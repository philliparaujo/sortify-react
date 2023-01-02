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

const genericGet = (request, token) => {
  return fetch(`${baseURI}/${request}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((result) => result.json());
};

const genericPost = (request, token, data) => {
  return fetch(`${baseURI}/${request}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: data,
  }).then((result) => result.json());
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

/* array of all playlists (within a Promise) */
const getPlaylists = (token, user_id) => {
  return genericGet(`users/${user_id}/playlists`, token).then(
    (result) => result.items
  );
};

/* Information passed to App.js, re-rendered on update
 */
export function useApi() {
  const [token, setToken] = useState();

  const [name, setName] = useState();
  const [id, setID] = useState();
  const [email, setEmail] = useState();
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
    } else {
      window.localStorage.removeItem("token");

      // logged out
      setName(undefined);
      setID(undefined);
      setEmail(undefined);
    }
  }, [token]);

  /* on ID update, updates all related variables */
  useEffect(() => refreshPlaylists(), [id]);

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

  /* JSON of specific playlist (within a Promise) */
  const getPlaylist = (playlist_id) => {
    return genericGet(`playlists/${playlist_id}`, token)
      .then((result) => result.tracks)
      .then((result) => result.items);
  };

  /* post public playlist request w/o description (within a Promise) */
  const createPlaylist = () => {
    if (!authInfo.SCOPES.includes("playlist-modify-public")) {
      throw new Error("No permission to modify public playlists!");
    }

    const title = document.getElementById("newPlaylistNameInput").value;
    if (title === "") {
      throw new Error("Title can't be empty!");
    }

    const data = JSON.stringify({
      name: title,
      public: true,
    });
    return genericPost(`users/${id}/playlists`, token, data)
      .then(refreshPlaylists)
      .then((document.getElementById("newPlaylistNameInput").value = ""));
  };

  /* passes information to App.js */
  return token
    ? {
        name: name,
        id: id,
        email: email,
        playlists: playlists,
        isLoggedIn: window.localStorage.getItem("token") !== null,
        loginExpired: id === undefined,
        logout: () => setToken(undefined),
        refreshPlaylists: refreshPlaylists,
        getPlaylist: getPlaylist,
        createPlaylist: createPlaylist,
      }
    : {
        isLoggedIn: false,
        loginExpired: false,
        login: login,
      };
}
