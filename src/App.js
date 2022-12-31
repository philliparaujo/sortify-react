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

  const deselectPlaylist = () => {
    setPlaylistId(undefined);
  };

  // TODO: if token expires, delete it on refresh
  // TODO: change playlistPage to remove the minimum info as props

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

          {selectedPlaylist ? (
            <button onClick={deselectPlaylist}>Deselect playlist</button>
          ) : (
            <button disabled>Deselect playlist</button>
          )}

          <div>
            {api.id ? (
              <button onClick={api.createPlaylist}>Create Playlist</button>
            ) : null}
            <input id="newPlaylistNameInput" type="text" size="20"></input>
          </div>

          {api.playlists ? (
            <div>
              {api.playlists.map((playlist, index) => (
                <div key={index}>
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
              refreshPlaylists={api.refreshPlaylists}
              getPlaylist={api.getPlaylist}
              deselectPlaylist={deselectPlaylist}
            ></PlaylistPage>
          ) : null}
        </div>
      </div>
    </div>
  );
}
export default App;
