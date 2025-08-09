import { Outlet } from "react-router-dom/dist"
import { Navbar } from "../components/Navbar"
import Login from "../components/Login"
import { getCurrentUser, getFavorites } from "../data/starWarsData"
import { useState, useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"

// Base component that maintains the navbar throughout the page.
export const Layout = () => {
    const [user, setUser] = useState(null);
    const { dispatch } = useGlobalReducer();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            
            // If user is authenticated, load their favorites
            if (currentUser) {
                try {
                    const favorites = await getFavorites();
                    dispatch({ type: "set_favorites", payload: favorites });
                } catch (error) {
                    console.error("Failed to load favorites:", error);
                    // Don't fail the auth check if favorites fail to load
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    };

    const handleLoginSuccess = async (userData) => {
        setUser(userData);
        
        // Load favorites after successful login
        try {
            const favorites = await getFavorites();
            dispatch({ type: "set_favorites", payload: favorites });
        } catch (error) {
            console.error("Failed to load favorites after login:", error);
        }
    };

    const handleLogout = () => {
        setUser(null);
        // Clear favorites when logging out
        dispatch({ type: "set_favorites", payload: [] });
    };

    if (!user) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="bg-black position-relative min-vh-100 overflow-hidden">
            {/* Static colorful stars background */}
            <div className="position-fixed top-0 start-0 end-0 bottom-0" style={{
                backgroundImage: `
                    radial-gradient(1px 1px at 10% 20%, #00ffff, transparent),
                    radial-gradient(1px 1px at 25% 70%, #ff00ff, transparent),
                    radial-gradient(1px 1px at 40% 10%, #ffff00, transparent),
                    radial-gradient(1px 1px at 60% 80%, #00ff00, transparent),
                    radial-gradient(1px 1px at 75% 30%, #ff6600, transparent),
                    radial-gradient(1px 1px at 90% 60%, #ff0066, transparent),
                    radial-gradient(1px 1px at 15% 90%, #66ff00, transparent),
                    radial-gradient(1px 1px at 85% 15%, #0066ff, transparent),
                    radial-gradient(1px 1px at 30% 40%, #ff3300, transparent),
                    radial-gradient(1px 1px at 70% 65%, #3300ff, transparent),
                    radial-gradient(1px 1px at 50% 85%, #00ffaa, transparent),
                    radial-gradient(1px 1px at 95% 35%, #ffaa00, transparent),
                    radial-gradient(1px 1px at 5% 55%, #aa00ff, transparent),
                    radial-gradient(1px 1px at 45% 25%, #ff0099, transparent),
                    radial-gradient(1px 1px at 80% 45%, #99ff00, transparent),
                    radial-gradient(1px 1px at 35% 75%, #0099ff, transparent)
                `,
                backgroundSize: '200px 200px, 150px 150px, 300px 300px, 250px 250px, 180px 180px, 220px 220px, 160px 160px, 280px 280px, 190px 190px, 240px 240px, 170px 170px, 260px 260px, 140px 140px, 210px 210px, 230px 230px, 120px 120px',
                opacity: 0.6,
                zIndex: -2,
                pointerEvents: 'none'
            }}></div>
            
            {/* Additional static white stars layer */}
            <div className="position-fixed top-0 start-0 end-0 bottom-0" style={{
                backgroundImage: `
                    radial-gradient(0.5px 0.5px at 20% 50%, #ffffff, transparent),
                    radial-gradient(0.5px 0.5px at 60% 30%, #ffffff, transparent),
                    radial-gradient(0.5px 0.5px at 80% 70%, #ffffff, transparent),
                    radial-gradient(0.5px 0.5px at 40% 85%, #ffffff, transparent),
                    radial-gradient(0.5px 0.5px at 90% 20%, #ffffff, transparent),
                    radial-gradient(0.5px 0.5px at 10% 80%, #ffffff, transparent)
                `,
                backgroundSize: '100px 100px, 120px 120px, 80px 80px, 140px 140px, 110px 110px, 90px 90px',
                opacity: 0.4,
                zIndex: -1,
                pointerEvents: 'none'
            }}></div>
            
            <div className="position-relative" style={{ zIndex: 1 }}>
                <Navbar user={user} onLogout={handleLogout} />
                <Outlet />
            </div>
        </div>
    )
}