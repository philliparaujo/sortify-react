import "./App.css";
import React, { useEffect, useState } from "react";
import { useApi } from "./spotify.js";

function App() {
  const api = useApi();

  // playlistToggle defaults
  if (!localStorage.playlistToggle) {
    localStorage.setItem("playlistToggle", false);
  }
  const [playlistToggle, setPlaylistToggle] = useState(
    JSON.parse(localStorage.playlistToggle)
  );

  // playlistToggle toggles
  const togglePlaylists = () => {
    setPlaylistToggle(!playlistToggle);
  };
  useEffect(
    () => localStorage.setItem("playlistToggle", playlistToggle),
    [playlistToggle]
  );

  // API-hidden function extensions
  const logout = () => {
    api.logout();
    if (JSON.parse(localStorage.playlistToggle)) togglePlaylists();
  };

  return (
    <div className="App">
      <header className="App-header">
        {api.name ? <p>Hi, {api.name}</p> : <p></p>}
        <h1>Sortify</h1>
      </header>
      {!api.isLoggedIn ? (
        <button onClick={api.login}>Login</button>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
      {api.id ? (
        <button onClick={togglePlaylists}>Toggle playlists</button>
      ) : null}
      {playlistToggle === true && api.playlists ? (
        <div>
          {api.playlists.map((playlist, index) => (
            <a key={index} href={playlist.external_urls.spotify}>
              {playlist.name}
              <br></br>
            </a>
          ))}
          <a href="www.google.com">Hi</a>
        </div>
      ) : null}
    </div>
  );
}
export default App;
