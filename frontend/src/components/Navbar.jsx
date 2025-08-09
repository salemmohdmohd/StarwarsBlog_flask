import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { logoutUser } from "../data/starWarsData.jsx";

export const Navbar = ({ user, onLogout }) => {
	const { store, dispatch } = useGlobalReducer();
	
	const removeFavorite = (item) => {
		dispatch({
			type: "remove_favorite",
			payload: item
		});
	};

	const handleLogout = async () => {
		try {
			await logoutUser();
			onLogout();
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	const toggleMusic = () => {
		if (store.audio.isPlaying) {
			dispatch({ type: "pause_audio" });
		} else {
			// Resume the current song or start the Imperial March if no song is playing
			const songToPlay = store.audio.currentSong || "https://ia600304.us.archive.org/30/items/StarWarsTheImperialMarchDarthVadersTheme/Star%20Wars-%20The%20Imperial%20March%20(Darth%20Vader's%20Theme).mp3";
			dispatch({ type: "play_audio", payload: songToPlay });
		}
	};

  return (
	<nav className="navbar navbar-black bg-black sticky-top border-bottom border-secondary py-3" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)', backdropFilter: 'blur(10px)' }}>
			<div className="container">
				<Link to="/" className="text-decoration-none">
					<span className="navbar-brand mb-0" style={{ 
						fontSize: '2.5rem', 
						fontWeight: 'bold',
						textShadow: '0 0 20px #ffd700, 0 0 40px #ffd700, 0 0 60px #ffd700',
						background: 'linear-gradient(45deg, #ffd700, #ffed4a)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						fontFamily: '"Star Wars", "Arial Black", sans-serif',
						letterSpacing: '3px'
					}}>
						STAR WARS
					</span>
				</Link>
				<div className="ml-auto d-flex align-items-center">
					{user && (
						<span className="text-light me-3" style={{
							textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
							fontSize: '1.1rem'
						}}>
							Welcome, <span style={{ color: '#ffd700' }}>{user.email}</span>
						</span>
					)}
					
					<div className="dropdown me-3">
						<div className="btn btn-outline-warning dropdown-toggle border-neon" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{
							background: 'rgba(255, 215, 0, 0.1)',
							borderColor: '#ffd700',
							color: '#ffd700',
							textShadow: '0 0 10px #ffd700',
							boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
						}}>
							<i className="fas fa-star me-2"></i>Favorites ({store.favorites.length})
						</div>
						<ul className="dropdown-menu bg-black border-warning" style={{
							background: 'rgba(0, 0, 0, 0.95) !important',
							backdropFilter: 'blur(10px)',
							border: '1px solid #ffd700',
							boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
						}}>
							{store.favorites.length === 0 ? (
								<li><span className="dropdown-item text-light">No favorites yet</span></li>
							) : (
			store.favorites.map(item => (
			  <li key={item.id + '-' + item.type} className="dropdown-item d-flex justify-content-between align-items-center text-light" style={{
				  background: 'transparent',
				  borderBottom: '1px solid rgba(255, 215, 0, 0.2)'
			  }}>
				<span style={{ color: '#ffd700' }}>{item.name}</span>
				<button 
				  className="btn btn-sm btn-outline-danger"
				  onClick={() => removeFavorite(item)}
				  style={{
					  borderColor: '#dc2626',
					  color: '#dc2626',
					  background: 'rgba(220, 38, 38, 0.1)'
				  }}
				>
				  <i className="fas fa-trash"></i>
				</button>
			  </li>
			))
							)}						
						</ul>
					</div>
					
					{/* Music Control Button */}
					{user && (
						<button 
							className="btn btn-outline-info btn-sm me-3"
							onClick={toggleMusic}
							style={{
								borderColor: '#17a2b8',
								color: '#17a2b8',
								textShadow: '0 0 10px rgba(23, 162, 184, 0.5)',
								boxShadow: '0 0 10px rgba(23, 162, 184, 0.2)',
								background: 'rgba(23, 162, 184, 0.05)'
							}}
						>
							<i className={`fas ${store.audio.isPlaying ? 'fa-pause' : 'fa-play'} me-2`}></i>
							{store.audio.isPlaying ? 'Pause' : 'Play'} Music
						</button>
					)}
					
					{user && (
						<button 
							className="btn btn-outline-light btn-sm border-neon"
							onClick={handleLogout}
							style={{
								borderColor: '#ffffff',
								color: '#ffffff',
								textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
								boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
								background: 'rgba(255, 255, 255, 0.05)'
							}}
						>
							<i className="fas fa-sign-out-alt me-2"></i>Logout
						</button>
					)}
				</div>
			</div>
		</nav>
	);
};






