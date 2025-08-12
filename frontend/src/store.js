export const initialStore = () => {
  return {
    favorites: [],
    starWarsData: {
      characters: [],
      planets: [],
      vehicles: [],
    },
    user: null,
    audio: {
      isPlaying: false,
      currentSong: "",
      audioRef: null,
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

    case "set_favorites":
      return {
        ...store,
        favorites: action.payload,
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

    case "set_audio_ref":
      return {
        ...store,
        audio: {
          ...store.audio,
          audioRef: action.payload,
        },
      };

    case "set_audio_playing":
      return {
        ...store,
        audio: {
          ...store.audio,
          isPlaying: action.payload,
        },
      };

    case "set_current_song":
      return {
        ...store,
        audio: {
          ...store.audio,
          currentSong: action.payload,
        },
      };

    case "play_audio": {
      const { audioRef } = store.audio;
      const song = action.payload;
      if (audioRef && song) {
        audioRef.src = song;
        audioRef
          .play()
          .then(() => {
            // Audio started playing successfully
          })
          .catch((error) => {
            console.log("Audio autoplay prevented:", error);
          });
      }
      return {
        ...store,
        audio: {
          ...store.audio,
          isPlaying: true,
          currentSong: song,
        },
      };
    }

    case "pause_audio": {
      const { audioRef } = store.audio;
      if (audioRef) {
        audioRef.pause();
      }
      return {
        ...store,
        audio: {
          ...store.audio,
          isPlaying: false,
        },
      };
    }

    case "set_user":
      return {
        ...store,
        user: action.payload,
      };

    default:
      throw Error("Unknown action.");
  }
}
