import "./App.css";
import React, { useEffect, useState } from "react";
import { useApi } from "./spotify.js";
import { PlaylistPage } from "./playlistPage";

function App() {
  const api = useApi();
  const [playlistId, setPlaylistId] = useState();

  const deselectPlaylist = () => {
    setPlaylistId(undefined);
  };

  const selectedPlaylist =
    api.isLoggedIn && playlistId !== undefined
      ? api.playlists[playlistId]
      : null;

  // TODO: change playlistPage to take in the minimum info as props
  // TODO: create nav bar object
  // TODO: handle >100 tracks or >20 playlists

  // TODO: Auto generate sentence playlists

  return (
    <div className="App">
      <div className="nav-bar">
        {api.isLoggedIn ? <p>Hi, {api.name} </p> : <p></p>}

        {api.isLoggedIn ? (
          <button onClick={api.logout}> Logout </button>
        ) : (
          <button onClick={api.login}> Login </button>
        )}

        {api.isLoggedIn ? (
          <div>
            <button onClick={api.refreshPlaylists}> Refresh playlists</button>
          </div>
        ) : null}

        {api.isLoggedIn ? (
          selectedPlaylist ? (
            <button onClick={deselectPlaylist}>Deselect playlist</button>
          ) : (
            <button disabled>Deselect playlist</button>
          )
        ) : null}

        <div>
          {api.isLoggedIn ? (
            <button onClick={api.createPlaylist}>Create Playlist</button>
          ) : null}
          <input id="newPlaylistNameInput" type="text" size="20"></input>
        </div>

        {api.isLoggedIn && api.playlists ? (
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

      <div className="App-body">
        <header className="App-header">
          <h1>Sortify </h1>
        </header>

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
