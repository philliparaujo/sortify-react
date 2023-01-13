import { useEffect, useState } from "react";

/* Log-in info
 */
const authInfo = {
  CLIENT_ID: "4e395fc704b74c3dafb22621444b1e64",
  REDIRECT_URI: "http://localhost:3000",
  AUTH_ENDPOINT: "https://accounts.spotify.com/authorize",
  RESPONSE_TYPE: "token",
  SCOPES: [
    "user-read-email",
    "user-library-read",
    "playlist-modify-public",
    "user-library-modify",
    // "playlist-read-private",
    // "playlist-modify-private",
  ],
};

/* returns token, or creates one if it doesn't exist */
const getToken = () => {
  if (window.localStorage.getItem("token")) {
    return window.localStorage.getItem("token");
  }

  const hash = window.location.hash;
  if (!hash) {
    return;
  }

  const token = hash
    .substring(1)
    .split("&")
    .find((elem) => elem.startsWith("access_token"))
    .split("=")[1];

  window.location.hash = "";
  return token;
};

/* updates URL to spotify login popup */
const login = () => {
  window.location =
    `${authInfo.AUTH_ENDPOINT}` +
    `?client_id=${authInfo.CLIENT_ID}` +
    `&redirect_uri=${authInfo.REDIRECT_URI}` +
    `&response_type=${authInfo.RESPONSE_TYPE}` +
    `&scope=${authInfo.SCOPES.join(" ")}`;
};

/* Spotify API calls (returns Promises)
 */
const baseURI = "https://api.spotify.com/v1";

const baseHeaders = (requestType, token) => {
  return {
    method: requestType,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const genericGet = (request, token) => {
  return fetch(`${baseURI}/${request}`, baseHeaders("GET", token)).then(
    (result) => result.json()
  );
};

const genericPost = (request, token, data) => {
  return fetch(
    `${baseURI}/${request}`,
    Object.assign(baseHeaders("POST", token), { body: data })
  ).then((result) => result.json());
};

const genericPut = (request, token, data) => {
  return fetch(
    `${baseURI}/${request}`,
    Object.assign(baseHeaders("PUT", token), { body: data })
  ).then((result) => result.json());
};

const genericDelete = (request, token) => {
  return fetch(`${baseURI}/${request}`, baseHeaders("DELETE", token));
};

/* string (within a Promise) */
const getDisplayName = (token) => {
  return genericGet(`me`, token).then((result) => result.display_name);
};

/* string (within a Promise) */
const getID = (token) => {
  return genericGet(`me`, token).then((result) => result.id);
};

/* string (within a Promise) */
const getEmail = (token) => {
  if (!authInfo.SCOPES.includes("user-read-email")) {
    throw new Error("No permission to read user email!");
  }
  return genericGet(`me`, token).then((result) => result.email);
};

const getProfile = (token) => {
  return genericGet(`me`, token).then((result) => result.external_urls.spotify);
};

/* array of all playlists (within a Promise) */
const getPlaylists = (token, user_id) => {
  const getRestPlaylists = (href, token, playlists) => {
    return fetch(href, baseHeaders("GET", token))
      .then((result) => result.json())
      .then((result) => {
        // if last page
        if (!result.next) {
          return result.items;
        }

        // combine current page with last page
        return fetch(result.next, baseHeaders("GET", token))
          .then((result2) => result2.json())
          .then((result2) => result2.href)
          .then((result2) => getRestPlaylists(result2, token, playlists))
          .then((finishedResult2) => {
            playlists.push(finishedResult2);
            return result.items;
          });
      });
  };

  var firstPlaylists = [];
  var restPlaylists = [];

  return genericGet(`users/${user_id}/playlists`, token)
    .then((result) => {
      firstPlaylists.push(result.items);
      return getRestPlaylists(result.href, token, restPlaylists);
    })
    .then(() => {
      return firstPlaylists.concat(restPlaylists.reverse()).flat();
    });
};

/* 20-element array of song ids matching search bar (within a Promise) */
const searchByTitle = (songTitle, token) => {
  if (songTitle === "") {
    throw new Error("Song search title can't be empty!");
  }

  // return (
  //   genericGet(
  //     `search?query=${encodeURIComponent(`${songTitle}`)}&type=track`,
  //     token
  //   )
  return genericGet(
    `search?query=${encodeURIComponent(
      `"${songTitle}"`
    )}&type=track&album=${encodeURIComponent(`"${songTitle}"`)}`,
    token
  )
    .then((result) => result.tracks)
    .then((result) => result.items)
    .then((result) => result.map((item) => item.id));
  // .then((result) => result.map((item) => item.uri))
  // .then((result) => result.slice(0, 1))
};

/* Information passed to App.js, re-rendered on update
 */
export function useApi() {
  const [token, setToken] = useState();

  const [name, setName] = useState();
  const [id, setID] = useState();
  const [email, setEmail] = useState();
  const [profile, setProfile] = useState();
  const [playlists, setPlaylists] = useState();

  /* prevents repeated getToken calls to be undefined if hash already deleted */
  useEffect(() => {
    const t = getToken();
    if (t) {
      setToken(t);
    }
  }, []);

  /* on token update, updates all related variables */
  useEffect(() => {
    if (token) {
      window.localStorage.setItem("token", token);

      getDisplayName(token).then((result) => {
        if (!result) {
          // token expired
          setToken(undefined);
        } else {
          // logged in
          setName(result);
        }
      });
      getID(token).then((result) => setID(result));
      getEmail(token).then((result) => setEmail(result));
      getProfile(token).then((result) => setProfile(result));
    } else {
      window.localStorage.removeItem("token");

      // logged out
      setName(undefined);
      setID(undefined);
      setEmail(undefined);
      setProfile(undefined);
      setPlaylists(undefined);
    }
  }, [token]);

  /* On reload, set playlists */
  useEffect(() => {
    if (id) {
      getPlaylists(token, id).then((result) => setPlaylists(result));
    }
  }, [id, token]);

  /* Methods to pass to return object
   */

  /* sets playlists variable to array of all playlists */
  const refreshPlaylists = () => {
    if (id) {
      getPlaylists(token, id).then((result) => setPlaylists(result));
    } else {
      setPlaylists(undefined);
    }
  };

  /* array of track ids from a playlist (within a Promise) */
  const getPlaylistTrackIds = (playlist_id) => {
    if (!playlist_id) {
      return;
    }
    const getRestTrackIds = (href, token, tracks) => {
      return fetch(href, baseHeaders("GET", token))
        .then((result) => result.json())
        .then((result) => {
          // if last page
          if (!result.next) {
            return result.items.map((item) => item.track.id);
          }

          // combine current page with last page
          return fetch(result.next, baseHeaders("GET", token))
            .then((result2) => result2.json())
            .then((result2) => result2.href)
            .then((result2) => getRestTrackIds(result2, token, tracks))
            .then((finishedResult2) => {
              tracks.push(finishedResult2);
              return result.items.map((item) => item.track.id);
            });
        });
    };

    var firstTracks = [];
    var restTracks = [];

    return genericGet(`playlists/${playlist_id}`, token)
      .then((result) => result.tracks)
      .then((result) => {
        firstTracks.push(result.items.map((item) => item.track.id));
        return getRestTrackIds(result.href, token, restTracks);
      })
      .then(() => {
        return firstTracks.concat(restTracks.reverse()).flat();
      });
  };

  /* post public playlist request w/o description */
  const createPlaylist = (title) => {
    if (!authInfo.SCOPES.includes("playlist-modify-public")) {
      throw new Error("No permission to modify public playlists!");
    }

    if (title === "") {
      throw new Error("Title can't be empty!");
    }

    const data = JSON.stringify({
      name: title,
      public: true,
    });

    genericPost(`users/${id}/playlists`, token, data).then((result) => {
      refreshPlaylists();
      return result;
    });
  };

  /* add song matching search bar to playlist */
  const addSongToPlaylist = (playlist_id, title) => {
    if (!playlist_id) {
      return;
    }
    searchByTitle(title, token)
      .then((result) => getTrackById(result[0]))
      .then((result) => {
        console.log(result);
        const numSongs = getPlaylistTrackIds(playlist_id).length;
        const data = JSON.stringify({
          uris: [result.uri],
          position: numSongs,
        });
        genericPost(`playlists/${playlist_id}/tracks`, token, data).then(
          refreshPlaylists
        );
      });
  };

  /* track information from id (within a Promise) */
  const getTrackById = (song_id) => {
    return genericGet(`tracks/${song_id}`, token);
  };

  /* Updates order of song in playlist, returns snapshot id (within a Promise) */
  const updatePlaylistOrder = (playlist_id, song_index, new_index) => {
    const data = JSON.stringify({
      range_start: song_index,
      insert_before: new_index,
      range_length: 1,
    });
    return genericPut(`playlists/${playlist_id}/tracks`, token, data);
  };

  const deletePlaylist = (playlist_id) => {
    genericDelete(`playlists/${playlist_id}/followers`, token).then((result) =>
      refreshPlaylists()
    );
  };

  /* passes information to App.js */
  return token
    ? {
        name: name,
        id: id,
        email: email,
        profile: profile,
        playlists: playlists,
        isLoggedIn: window.localStorage.getItem("token") !== null,
        loginExpired: id === undefined,
        logout: () => setToken(undefined),
        refreshPlaylists: refreshPlaylists,
        getPlaylistTrackIds: getPlaylistTrackIds,
        createPlaylist: createPlaylist,
        addSongToPlaylist: addSongToPlaylist,
        getTrackById: getTrackById,
        updatePlaylistOrder: updatePlaylistOrder,
        deletePlaylist: deletePlaylist,
      }
    : {
        isLoggedIn: false,
        loginExpired: false,
        login: login,
      };
}
