
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
        <Link to="/" className="btn btn-primary"></Link>
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
    const detailStyle = {
      marginBottom: '1rem',
      padding: '0.5rem 0',
      borderBottom: '1px solid rgba(255, 215, 0, 0.2)'
    };

    const labelStyle = {
      color: '#ffd700',
      fontWeight: 'bold',
      textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
      marginRight: '0.5rem'
    };

    const valueStyle = {
      color: '#ffffff',
      textShadow: '0 0 3px rgba(255, 255, 255, 0.3)'
    };

    if (item.type === "planet") {
      return (
        <div className="row">
          <div className="col-12">
            <div style={detailStyle}>
              <span style={labelStyle}>Climate:</span>
              <span style={valueStyle}>{item.climate}</span>
            </div>
            <div style={detailStyle}>
              <span style={labelStyle}>Population:</span>
              <span style={valueStyle}>{item.population || 'Unknown'}</span>
            </div>
          </div>
        </div>
      );
    } else if (item.type === "vehicle") {
      return (
        <div className="row">
          <div className="col-lg-6">
            <div style={detailStyle}>
              <span style={labelStyle}>Model:</span>
              <span style={valueStyle}>{item.model}</span>
            </div>
            <div style={detailStyle}>
              <span style={labelStyle}>Manufacturer:</span>
              <span style={valueStyle}>{item.manufacturer}</span>
            </div>
            <div style={detailStyle}>
              <span style={labelStyle}>Length:</span>
              <span style={valueStyle}>{item.length || 'Unknown'}</span>
            </div>
          </div>
          <div className="col-lg-6">
            <div style={detailStyle}>
              <span style={labelStyle}>Crew:</span>
              <span style={valueStyle}>{item.crew}</span>
            </div>
            <div style={detailStyle}>
              <span style={labelStyle}>Passengers:</span>
              <span style={valueStyle}>{item.passengers}</span>
            </div>
            <div style={detailStyle}>
              <span style={labelStyle}>Cost:</span>
              <span style={valueStyle}>{item.cost_in_credits} credits</span>
            </div>
          </div>
        </div>
      );
    } else {
      // Character details
      return (
        <div className="row">
          <div className="col-12">
            <div style={detailStyle}>
              <span style={labelStyle}>Birth Year:</span>
              <span style={valueStyle}>{item.birthYear}</span>
            </div>
            <div style={detailStyle}>
              <span style={labelStyle}>Gender:</span>
              <span style={valueStyle}>{item.gender}</span>
            </div>
          
          </div>
        </div>
      );
    }
  };


  return (
    <div className="min-vh-100 d-flex flex-column" style={{ 
      position: 'relative'
    }}>
      <div className="container-fluid flex-grow-1 d-flex align-items-center py-2" style={{ zIndex: 1 }}>
        <div className="row w-100 justify-content-center align-items-center" style={{ minHeight: '95vh' }}>
          <div className="col-12 col-xl-11 col-xxl-10">
            <div className="card text-white shadow-lg" style={{
              background: 'rgba(0, 0, 0, 0.85)',
              border: '2px solid #ffd700',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.3), inset 0 0 30px rgba(255, 215, 0, 0.1)'
            }}>
              <div className="row g-0" style={{ minHeight: '300px' }}>
                <div className="col-lg-5 d-flex align-items-center justify-content-center ">
                  <div className="position-relative w-100" style={{ maxWidth: '450px' }}>
                    <img 
                      src={item.image_url || rigoImageUrl} 
                      className="img-fluid rounded shadow-lg w-100" 
                      alt={item.name}
                      style={{ 
                        objectFit: "cover",
                        height: '500px',
                        filter: item.image_url ? "none" : "brightness(0.5)",
                        border: '2px solid rgba(255, 215, 0, 0.5)',
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
                      }}
                      onError={(e) => {
                        e.target.src = rigoImageUrl;
                        e.target.style.filter = "brightness(0.5)";
                      }}
                    />
                    {/* Glowing effect overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '-2px',
                      left: '-2px',
                      right: '-2px',
                      bottom: '-2px',
                      background: 'linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.2), transparent)',
                      borderRadius: '8px',
                      pointerEvents: 'none'
                    }}></div>
                  </div>
                </div>
                <div className="col-lg-7 d-flex align-items-center">
                  <div className="card-body ">
                    <h1 className="card-title mb-3" style={{ 
                      fontSize: '2rem', 
                      fontWeight: 'bold',
                      textShadow: '0 0 15px #ffd700, 0 0 30px #ffd700',
                      background: 'linear-gradient(45deg, #ffd700, #ffed4a)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontFamily: '"Star Wars", "Arial Black", sans-serif',
                      letterSpacing: '1px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.name}
                    </h1>
                    
                    <p className="card-text mb-3" style={{
                      fontSize: '1.1rem',
                      lineHeight: '1.5',
                      color: '#e0e0e0',
                      textShadow: '0 0 5px rgba(255, 255, 255, 0.3)'
                    }}>
                      {item.description}
                    </p>
                    
                    <hr style={{ 
                      border: 'none', 
                      height: '2px', 
                      background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
                      margin: '1.5rem 0'
                    }} />

                    <div style={{ fontSize: '1rem' }}>
                      {renderDetails()}
                    </div>
                    
                    <div className="d-flex gap-3 mt-4">
                      <Link to="/" className="btn btn-lg px-4" style={{
                        background: 'linear-gradient(45deg, #007bff, #0056b3)',
                        border: '2px solid #007bff',
                        color: 'white',
                        borderRadius: '25px',
                        textShadow: '0 0 10px rgba(0, 123, 255, 0.5)',
                        boxShadow: '0 0 15px rgba(0, 123, 255, 0.3)',
                        transition: 'all 0.3s ease'
                      }}>
                        <i className="fas fa-arrow-left me-2"></i>
                      </Link>
                      <button 
                        className={`btn btn-lg px-4`}
                        onClick={handleFavorite}
                        style={{
                          background: isInFavorites 
                            ? 'linear-gradient(45deg, #ffd700, #ffed4a)' 
                            : 'transparent',
                          border: '2px solid #ffd700',
                          color: isInFavorites ? '#000' : '#ffd700',
                          borderRadius: '25px',
                          textShadow: isInFavorites ? 'none' : '0 0 10px rgba(255, 215, 0, 0.5)',
                          boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
                          transition: 'all 0.3s ease',
                          fontWeight: 'bold'
                        }}
                      >
                        <i className="fas fa-heart me-2"></i>
                        {isInFavorites ? '' : ''}
                      </button>
                    </div>
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
