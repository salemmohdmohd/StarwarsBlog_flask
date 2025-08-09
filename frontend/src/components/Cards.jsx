import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
function Cards({ item }) {
  const { store, dispatch } = useGlobalReducer();
  if (!item) return null;
  const isInFavorites = store.favorites.some(fav => fav.id === item.id && fav.type === item.type);
  const handleFavorite = () => {
    dispatch({
      type: isInFavorites ? "remove_favorite" : "add_favorite",
      payload: item
    });
  };

  return (
    <div className="card bg-secondary text-white border-light shadow" style={{width: "18rem", borderWidth: "2px"}}>
      <img
        src={rigoImageUrl}
        className="card-img-top"
        style={{ height: "10rem", borderWidth: "2px", borderStyle: "solid", borderColor: "#333", filter: "brightness(0.5)" }}
        alt={item.name}
      />
      <div className="card-body">
        <h5 className="card-title">{item.name}</h5>
        {item.type === "planet" ? (
          <p className="card-text">
            <small className="text-muted">Climate: {item.climate}</small><br />
            <small className="text-muted">Terrain: {item.terrain}</small><br />
            <small className="text-muted">Population: {item.population}</small>
          </p>
        ) : (
          <p className="card-text">
            <small className="text-muted">Gender: {item.gender}</small><br />
            <small className="text-muted">Hair Color: {item.hair}</small><br />
            <small className="text-muted">Eye Color: {item.eyes}</small>
          </p>
        )}
        <div className="d-flex justify-content-between">
          <Link to={`/${item.type === "planet" ? "planet" : item.type === "vehicle" ? "vehicle" : "character"}/${item.uid}`} className="btn btn-dark btn-sm">
            more...
          </Link>
          <button 
            className={`btn btn-sm ${isInFavorites ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={handleFavorite}
          >
            <i className="fas fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cards;
