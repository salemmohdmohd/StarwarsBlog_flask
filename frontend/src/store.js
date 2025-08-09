export const initialStore = () => {
  return {
    favorites: [],
    starWarsData: {
      characters: [],
      planets: [],
      vehicles: [],
    },
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_star_wars_data":
      return {
        ...store,
        starWarsData: action.payload,
      };

    case "add_favorite": {
      const item = action.payload;
      if (
        store.favorites.find(
          (fav) => fav.id === item.id && fav.type === item.type
        )
      ) {
        return store;
      }
      return {
        ...store,
        favorites: [...store.favorites, item],
      };
    }

    case "remove_favorite": {
      const item = action.payload;
      return {
        ...store,
        favorites: store.favorites.filter(
          (fav) => !(fav.id === item.id && fav.type === item.type)
        ),
      };
    }

    default:
      throw Error("Unknown action.");
  }
}
