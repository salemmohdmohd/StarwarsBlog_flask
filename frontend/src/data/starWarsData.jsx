// API functions for interacting with the backend
const BASE_URL = '/api';

// JWT token utilities
export const saveToken = (token) => sessionStorage.setItem('token', token);
export const getToken = () => sessionStorage.getItem('token');
export const removeToken = () => sessionStorage.removeItem('token');
export const isAuthenticated = () => !!getToken();

// Helper to add Authorization header
const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Authentication API functions
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    if (data.access_token) {
      saveToken(data.access_token);
    }
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  removeToken();
  // Optionally, call backend to blacklist token if implemented
  return { message: 'Logged out' };
};

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/protected`, {
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      return null; // Not authenticated
    }
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const fetchVehicles = async () => {
  try {
    const res = await fetch("/api/vehicles");
    const vehicles = await res.json();
    return vehicles.map(vehicle => ({
      uid: vehicle.id.toString(),
      id: vehicle.id,
      name: vehicle.name,
      model: vehicle.model,
      manufacturer: vehicle.manufacturer,
      image_url: vehicle.image_url,
      type: "vehicle"
    }));
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
};

export const fetchPeople = async () => {
  try {
    const res = await fetch("/api/people");
    const people = await res.json();
    return people.map(person => ({
      uid: person.id.toString(),
      id: person.id,
      name: person.name,
      gender: person.gender,
      birthYear: person.birth_year,
      image_url: person.image_url,
      type: "character"
    }));
  } catch (error) {
    console.error("Error fetching people:", error);
    return [];
  }
};

export const fetchPlanets = async () => {
  try {
    const res = await fetch("/api/planets");
    const planets = await res.json();
    return planets.map(planet => ({
      uid: planet.id.toString(),
      id: planet.id,
      name: planet.name,
      climate: planet.climate,
      population: planet.population,
      image_url: planet.image_url,
      type: "planet"
    }));
  } catch (error) {
    console.error("Error fetching planets:", error);
    return [];
  }
};

export const getStarWarsData = async () => {
  const [characters, planets, vehicles] = await Promise.all([
    fetchPeople(),
    fetchPlanets(),
    fetchVehicles()
  ]);
  console.log("getStarWarsData result:", { characters, planets, vehicles });
  return { characters, planets, vehicles };
};

// Favorites API functions
export const getFavorites = async () => {
  try {
    const res = await fetch("/api/users/favorites", {
      headers: authHeader(),
    });
    if (!res.ok) {
      throw new Error('Authentication required');
    }
    const backendFavorites = await res.json();
    // Transform backend format to frontend format
    const frontendFavorites = backendFavorites.map(fav => {
      if (fav.people) {
        return {
          uid: fav.people.id.toString(),
          id: fav.people.id,
          name: fav.people.name,
          gender: fav.people.gender,
          birthYear: fav.people.birth_year,
          image_url: fav.people.image_url,
          type: "character"
        };
      } else if (fav.planet) {
        return {
          uid: fav.planet.id.toString(),
          id: fav.planet.id,
          name: fav.planet.name,
          climate: fav.planet.climate,
          population: fav.planet.population,
          image_url: fav.planet.image_url,
          type: "planet"
        };
      } else if (fav.vehicle) {
        return {
          uid: fav.vehicle.id.toString(),
          id: fav.vehicle.id,
          name: fav.vehicle.name,
          model: fav.vehicle.model,
          manufacturer: fav.vehicle.manufacturer,
          image_url: fav.vehicle.image_url,
          type: "vehicle"
        };
      }
      return null;
    }).filter(Boolean); // Remove any null entries
    return frontendFavorites;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

export const addFavorite = async (type, id) => {
  try {
    // Map frontend types to backend routes
    const typeMap = {
      character: 'people',
      planet: 'planet',
      vehicle: 'vehicle'
    };
    
    const backendType = typeMap[type] || type;
    const res = await fetch(`/api/favorite/${backendType}/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader()
      },
      credentials: 'include'
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.msg || 'Failed to add favorite');
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
};

export const removeFavorite = async (type, id) => {
  try {
    // Map frontend types to backend routes
    const typeMap = {
      character: 'people',
      planet: 'planet',
      vehicle: 'vehicle'
    };
    
    const backendType = typeMap[type] || type;
    const res = await fetch(`/api/favorite/${backendType}/${id}`, {
      method: "DELETE",
      headers: {
        ...authHeader()
      },
      credentials: 'include'
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.msg || 'Failed to remove favorite');
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
};

