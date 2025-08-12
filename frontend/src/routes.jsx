// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { CardView } from "./pages/CardView";
import { Home } from "./pages/Home";
import { Layout } from "./pages/Layout";

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
  <Route path= "/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
        <Route path="/character/:characterId" element={<CardView />} />
        <Route path="/planet/:characterId" element={<CardView />} />
        <Route path="/vehicle/:vehicleId" element={<CardView />} />
      </Route>
    )
);