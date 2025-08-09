import { Outlet } from "react-router-dom/dist"
import { Navbar } from "../components/Navbar"

// Base component that maintains the navbar throughout the page.
export const Layout = () => {
    return (
        <>
            <Navbar />
                <Outlet />
        </>
    )
}