import { Outlet } from "react-router-dom/dist"
import { Navbar } from "../components/Navbar"
import Login from "../components/Login"
import { getCurrentUser, getFavorites } from "../data/starWarsData"
import { useState, useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"

// Base component that maintains the navbar throughout the page.
export const Layout = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
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
        } finally {
            setLoading(false);
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

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f1419)',
                color: '#fff'
            }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (!user) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <>
            <Navbar user={user} onLogout={handleLogout} />
            <Outlet />
        </>
    )
}