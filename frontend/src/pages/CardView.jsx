
import { useParams, useLocation, Link } from "react-router-dom";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { addFavorite, removeFavorite } from "../data/starWarsData.jsx";

export const CardView = () => {
  const params = useParams();
  const location = useLocation();
  const { store, dispatch } = useGlobalReducer();

  // Determine type and param based on route
  let type = "character";
  let id;
  if (location.pathname.startsWith("/planet/")) {
    type = "planet";
    id = parseInt(params.characterId || params.planetId);
  } else if (location.pathname.startsWith("/vehicle/")) {
    type = "vehicle";
    id = parseInt(params.vehicleId);
  } else {
    id = parseInt(params.characterId);
  }

  // Select the correct array based on type
  let dataArr;
  if (type === "planet") {
    dataArr = store.starWarsData.planets;
  } else if (type === "vehicle") {
    dataArr = store.starWarsData.vehicles;
  } else {
    dataArr = store.starWarsData.characters;
  }
  const item = dataArr && dataArr.find(item => item.id === id);

  if (!item) {
    return (
      <div className="container text-center mt-5">
        <h1>Item not found!</h1>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const isInFavorites = store.favorites.some(fav => fav.id === item.id && fav.type === item.type);

  const handleFavorite = async () => {
    try {
      if (isInFavorites) {
        // Remove from backend
        await removeFavorite(item.type, item.id);
        // Update local state
        dispatch({
          type: "remove_favorite",
          payload: item
        });
      } else {
        // Add to backend
        await addFavorite(item.type, item.id);
        // Update local state
        dispatch({
          type: "add_favorite",
          payload: item
        });
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
      // You could show a user-friendly error message here
      alert("Failed to update favorite. Please try again.");
    }
  };

  // Render different content based on type
  const renderDetails = () => {
    if (item.type === "planet") {
      return (
        <div className="row">
          <div className="col-6">
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Climate:</strong> {item.climate}</p>
            <p><strong>Terrain:</strong> {item.terrain}</p>
          </div>
        </div>
      );
    } else if (item.type === "vehicle") {
      return (
        <div className="row">
          <div className="col-6">
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Model:</strong> {item.model}</p>
            <p><strong>Manufacturer:</strong> {item.manufacturer}</p>
          </div>
          <div className="col-6">
            <p><strong>Crew:</strong> {item.crew}</p>
            <p><strong>Passengers:</strong> {item.passengers}</p>
            <p><strong>Cost in Credits:</strong> {item.cost_in_credits}</p>
          </div>
        </div>
      );
    } else {
      // Character details
      return (
        <div className="row">
          <div className="col-6">
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Birth Year:</strong> {item.birthYear}</p>
            <p><strong>Gender:</strong> {item.gender}</p>
          </div>
        </div>
      );
    }
  };


  return (
    <div className="container mt-5 bg-dark text-white min-vh-100 py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card bg-secondary text-white border-light shadow">
            <div className="row g-0">
              <div className="col-md-4">
                <img 
                  src={item.image_url || rigoImageUrl} 
                  className="img-fluid rounded-start h-40" 
                  alt={item.name}
                  style={{ 
                    objectFit: "cover",
                    filter: item.image_url ? "none" : "brightness(0.5)"
                  }}
                  onError={(e) => {
                    e.target.src = rigoImageUrl;
                    e.target.style.filter = "brightness(0.5)";
                  }}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h1 className="card-title">{item.name}</h1>
                  <p className="card-text">
                    {item.description}
                  </p>
                  
                  <hr />

                  {renderDetails()}
                  
                  <div className="d-flex gap-2 mt-4">
                    <Link to="/" className="btn btn-primary">
                      <i className="fas fa-arrow-left"></i>
                    </Link>
                    <button 
                      className={`btn ${isInFavorites ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={handleFavorite}
                    >
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
