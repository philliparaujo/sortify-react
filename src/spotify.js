import { useEffect, useState } from "react";

// Log-in info
//
const authInfo = {
  CLIENT_ID: "4e395fc704b74c3dafb22621444b1e64",
  REDIRECT_URI: "http://localhost:3000",
  AUTH_ENDPOINT: "https://accounts.spotify.com/authorize",
  RESPONSE_TYPE: "token",
  SCOPES: ["user-read-email", "playlist-read-private", "user-library-read"],
};

const getToken = () => {
  if (window.localStorage.getItem("token"))
    return window.localStorage.getItem("token");

  const hash = window.location.hash;
  if (!hash) return;

  const token = hash
    .substring(1)
    .split("&")
    .find((elem) => elem.startsWith("access_token"))
    .split("=")[1];

  window.location.hash = "";
  return token;
};

const login = () => {
  // update URL to spotify login popup
  window.location =
    `${authInfo.AUTH_ENDPOINT}` +
    `?client_id=${authInfo.CLIENT_ID}` +
    `&redirect_uri=${authInfo.REDIRECT_URI}` +
    `&response_type=${authInfo.RESPONSE_TYPE}` +
    `&scope=${authInfo.SCOPES.join(" ")}`;
};

// Spotify API calls (returns Promises)
//
const genericAPI = (request, token) => {
  return fetch(`https://api.spotify.com/v1/${request}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((result) => result.json());
};

// string (within a Promise)
const getDisplayName = (token) => {
  return genericAPI(`me`, token).then((result) => result.display_name);
};

// string (within a Promise)
const getID = (token) => {
  return genericAPI(`me`, token).then((result) => result.id);
};

// string (within a Promise)
const getEmail = (token) => {
  if (!authInfo.SCOPES.includes("user-read-email")) {
    throw new Error("No permission to read user email!");
  }
  return genericAPI(`me`, token).then((result) => result.email);
};

// array of all playlists (within a Promise)
const getPlaylists = (token, user_id) => {
  return genericAPI(`users/${user_id}/playlists`, token).then(
    (result) => result.items
  );
};

// Information passed to App.js, re-rendered on update
//
export function useApi() {
  const [token, setToken] = useState();

  const [name, setName] = useState();
  const [id, setID] = useState();
  const [email, setEmail] = useState();
  const [playlists, setPlaylists] = useState();

  // prevents repeated getToken calls to be undefined if hash already deleted
  useEffect(() => {
    const t = getToken();
    if (t) {
      console.log("setting token");
      setToken(t);
    }
  }, []);

  // on token update, updates all related variables
  useEffect(() => {
    if (token) {
      window.localStorage.setItem("token", token);
      // logged in
      getDisplayName(token).then((name) => setName(name));
      getID(token).then((id) => setID(id));
      getEmail(token).then((email) => setEmail(email));
    } else {
      window.localStorage.removeItem("token");
      // logged out
      setName(undefined);
      setID(undefined);
      setEmail(undefined);
    }
  }, [token]);

  // on ID update, updates all related variables
  const refreshPlaylists = () => {
    if (id) {
      getPlaylists(token, id).then((playlist) => setPlaylists(playlist));
    } else {
      setPlaylists(undefined);
    }
  };
  useEffect(() => refreshPlaylists(), [id]);

  // JSON of specific playlist (within a Promise)
  const getPlaylist = (playlist_id) => {
    return genericAPI(`playlists/${playlist_id}`, token)
      .then((result) => result.tracks)
      .then((result) => result.items);
  };

  // passes information to App.js
  return token
    ? {
        name: name,
        id: id,
        email: email,
        isLoggedIn: window.localStorage.getItem("token") !== null,
        playlists: playlists,
        logout: () => setToken(undefined),
        refreshPlaylists: refreshPlaylists,
        getPlaylist: getPlaylist,
      }
    : {
        isLoggedIn: false,
        login: login,
      };
}
