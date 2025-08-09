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

  return (
	<nav className="navbar navbar-dark bg-black sticky-top border-bottom border-secondary">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">StarWarrs</span>
				</Link>
				<div className="ml-auto d-flex align-items-center">
					{user && (
						<span className="text-light me-3">
							Welcome, {user.email}
						</span>
					)}
					
					<div className="dropdown me-3">
						<div className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
							favorites  {store.favorites.length}
						</div>
						<ul className="dropdown-menu">
							{store.favorites.length === 0 ? (
								<li><span className="dropdown-item">No favorites yet</span></li>
							) : (
			store.favorites.map(item => (
			  <li key={item.id + '-' + item.type} className="dropdown-item d-flex justify-content-between align-items-center">
				<span>{item.name}</span>
				<button 
				  className="btn btn-sm btn-outline-danger"
				  onClick={() => removeFavorite(item)}
				>
				  <i className="fas fa-trash"></i>
				</button>
			  </li>
			))
							)}						
						</ul>
					</div>
					
					{user && (
						<button 
							className="btn btn-outline-light btn-sm"
							onClick={handleLogout}
						>
							Logout
						</button>
					)}
				</div>
			</div>
		</nav>
	);
};






