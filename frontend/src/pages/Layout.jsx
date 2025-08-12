import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Login from "../components/Login";
import { Navbar } from "../components/Navbar";
import { getCurrentUser, getFavorites, removeToken } from "../data/starWarsData.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer";

// Base component that maintains the navbar throughout the page.
export const Layout = () => {
    const { store, dispatch } = useGlobalReducer();
    // On app load, if user is authenticated, fetch favorites
    useEffect(() => {
        if (store.user) {
            getFavorites().then(favorites => {
                dispatch({ type: "set_favorites", payload: favorites });
            }).catch(err => {
                console.error("Failed to fetch favorites on app load", err);
            });
        }
    }, [store.user, dispatch]);
    // Restore user from token on app load
    useEffect(() => {
        if (!store.user) {
            getCurrentUser().then(user => {
                if (user) {
                    dispatch({ type: "set_user", payload: user });
                }
            });
        }
    }, [store.user, dispatch]);
    const location = useLocation();

    // Allow unauthenticated access to /signup (and optionally /login)
    if (!store.user && location.pathname === "/signup") {
        return <Outlet />;
    }
    if (!store.user) {
        return <Login />;
    }

    const handleLogout = () => {
        removeToken();
        dispatch({ type: "set_user", payload: null });
        dispatch({ type: "set_favorites", payload: [] });
    };

    return (
        <div className="main-container bg-black position-relative">
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: -1,
                    pointerEvents: "none",
                    background: `#000,
                        radial-gradient(white 1px, transparent 1px),
                        radial-gradient(white 1.5px, transparent 1.5px),
                        radial-gradient(white 0.8px, transparent 0.8px)
                    `,
                    backgroundSize: "100px 100px, 150px 150px, 200px 200px",
                    backgroundPosition: "0 0, 50px 50px, 100px 100px",
                    opacity: 0.7,
                }}
            ></div>
            <div className="position-relative" style={{ zIndex: 1 }}>
                <Navbar user={store.user} onLogout={handleLogout} />
                <Outlet />
            </div>
        </div>
    );
};