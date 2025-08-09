// Import necessary hooks and functions from React.
import { useContext, useReducer, createContext, useEffect, useRef } from "react";
import storeReducer, { initialStore } from "../store"  // Import the reducer and the initial state.

// Create a context to hold the global state of the application
// We will call this global state the "store" to avoid confusion while using local states
const StoreContext = createContext()

// Define a provider component that encapsulates the store and warps it in a context provider to 
// broadcast the information throught all the app pages and components.
export function StoreProvider({ children }) {
    // Initialize reducer with the initial state.
    const [store, dispatch] = useReducer(storeReducer, initialStore())
    const audioRef = useRef(null);

    // Set up the audio ref in the store when component mounts
    useEffect(() => {
        if (audioRef.current) {
            dispatch({
                type: "set_audio_ref",
                payload: audioRef.current
            });
        }
    }, []);

    // Provide the store and dispatch method to all child components.
    return <StoreContext.Provider value={{ store, dispatch }}>
        {children}
        <audio 
            ref={audioRef}
            preload="auto"
            loop
            onPlay={() => dispatch({ type: "set_audio_playing", payload: true })}
            onPause={() => dispatch({ type: "set_audio_playing", payload: false })}
        />
    </StoreContext.Provider>
}

// Custom hook to access the global state and dispatch function.
export default function useGlobalReducer() {
    const { dispatch, store } = useContext(StoreContext)
    return { dispatch, store };
}