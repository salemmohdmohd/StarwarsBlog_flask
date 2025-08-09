// Updated to use local backend API instead of external SWAPI

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
    const res = await fetch("/api/users/favorites");
    return await res.json();
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

export const addFavorite = async (type, id) => {
  try {
    const res = await fetch(`/api/favorite/${type}/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  } catch (error) {
    console.error("Error adding favorite:", error);
    return null;
  }
};

export const removeFavorite = async (type, id) => {
  try {
    const res = await fetch(`/api/favorite/${type}/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("Error removing favorite:", error);
    return null;
  }
};

