import "./App.css";
import React, { useEffect, useState } from "react";
import { useApi } from "./spotify.js";
import { PlaylistPage } from "./playlistPage";

function App() {
  const api = useApi();
  const [playlistId, setPlaylistId] = useState();

  const selectedPlaylist =
    api.playlists !== undefined && playlistId !== undefined
      ? api.playlists[playlistId]
      : null;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sortify </h1>
      </header>

      <div className="App-body">
        <div className="nav-bar">
          {api && api.name ? <p>Hi, {api.name} </p> : <p></p>}

          {!api.isLoggedIn ? (
            <button onClick={api.login}> Login </button>
          ) : (
            <button onClick={api.logout}> Logout </button>
          )}

          {api.id ? (
            <div>
              <button onClick={api.refreshPlaylists}> Refresh playlists</button>
            </div>
          ) : null}

          {api.id ? (
            selectedPlaylist ? (
              <button onClick={() => setPlaylistId(undefined)}>
                Deselect playlist
              </button>
            ) : (
              <button disabled onClick={() => setPlaylistId(undefined)}>
                Deselect playlist
              </button>
            )
          ) : null}

          {api.playlists ? (
            <div>
              {api.playlists.map((playlist, index) => (
                <div>
                  <button
                    className="playlistTitles"
                    key={index}
                    onClick={() => setPlaylistId(index)}
                  >
                    {playlist.name}
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="content">
          {selectedPlaylist ? (
            <PlaylistPage
              playlist={selectedPlaylist}
              getPlaylist={api.getPlaylist}
            ></PlaylistPage>
          ) : null}
        </div>
      </div>
    </div>
  );
}
export default App;
