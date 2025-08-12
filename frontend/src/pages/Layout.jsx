import { Outlet, useLocation } from "react-router-dom";
import Login from "../components/Login";
import { Navbar } from "../components/Navbar";
import useGlobalReducer from "../hooks/useGlobalReducer";

// Base component that maintains the navbar throughout the page.
export const Layout = () => {
    const { store } = useGlobalReducer();
    const location = useLocation();

    // Allow unauthenticated access to /signup (and optionally /login)
    if (!store.user && location.pathname === "/signup") {
        return <Outlet />;
    }
    if (!store.user) {
        return <Login />;
    }

    return (
        <div className="main-container bg-black position-relative">
            {/* Static colorful stars background */}
            <div className="position-fixed top-0 start-0 end-0 bottom-0" style={{
                backgroundImage: `
                    radial-gradient(1px 1px at 10% 20%, #00ffff, transparent),
                    radial-gradient(1px 1px at 25% 70%, #ff00ff, transparent),
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
                <Navbar user={store.user} />
                <Outlet />
            </div>
        </div>
    );
};