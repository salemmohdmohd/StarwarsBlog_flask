// Import necessary components and functions from react-router-dom.

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { CardView } from "./pages/CardView";

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
        <Route path= "/" element={<Home />} />
        <Route path="/character/:characterId" element={<CardView />} />
        <Route path="/planet/:characterId" element={<CardView />} />
        <Route path="/vehicle/:vehicleId" element={<CardView />} />
      </Route>
    )
);