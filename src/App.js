import "./App.css";
import React, { createContext, useState } from "react";
import { useApi } from "./spotify.js";
import { PlaylistPage } from "./playlistPage";
import { NavBar } from "./navBar";

export const PlaylistId = createContext();

export function App() {
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
  // TODO: fix appPadding for content scrolling

  // TODO: Auto generate sentence playlists

  return (
    <div className="App">
      <PlaylistId.Provider value={[{ playlistId, setPlaylistId }]}>
        <NavBar
          isLoggedIn={api.isLoggedIn}
          name={api.name}
          playlists={api.playlists}
          selectedPlaylist={selectedPlaylist}
          deselectPlaylist={deselectPlaylist}
          login={api.login}
          logout={api.logout}
          refreshPlaylists={api.refreshPlaylists}
          createPlaylist={api.createPlaylist}
          addSongToPlaylist={api.addSongToPlaylist}
        ></NavBar>
      </PlaylistId.Provider>

      <div className="App-body">
        <header className="App-header">
          <h1>Sortify </h1>
        </header>

        <div className="content">
          {selectedPlaylist ? (
            <PlaylistPage
              playlist={selectedPlaylist}
              refreshPlaylists={api.refreshPlaylists}
              getPlaylistTracks={api.getPlaylistTracks}
              deselectPlaylist={deselectPlaylist}
            ></PlaylistPage>
          ) : null}
        </div>
      </div>
    </div>
  );
}
export default App;
