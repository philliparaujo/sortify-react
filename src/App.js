import "./App.css";
import React, { createContext, useState } from "react";
import { useApi } from "./spotify.js";
import { PlaylistPage } from "./playlistPage";
import { NavBar } from "./navBar";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const PlaylistIndex = createContext();

export function App() {
  const api = useApi();
  const [playlistIndex, setPlaylistIndex] = useState();

  const deselectPlaylist = () => {
    setPlaylistIndex(undefined);
  };

  const selectedPlaylist =
    api.isLoggedIn && playlistIndex !== undefined
      ? api.playlists[playlistIndex]
      : null;

  // TODO: change playlistPage to take in the minimum playlist info as props
  // TODO: fix appPadding for content scrolling
  // TODO: change URIComponent to URL object & query params in spotify.js searchByTitle
  // TODO: handle duplicate song ids

  // TODO: fix app coloring
  // TODO: fix drag and drop when dragging to same bucket

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <PlaylistIndex.Provider value={{ playlistIndex, setPlaylistIndex }}>
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
        </PlaylistIndex.Provider>

        <div className="App-body">
          <header className="App-header">
            <h1>Sortify </h1>
          </header>

          <div className="content">
            {selectedPlaylist ? (
              <PlaylistPage
                playlist={selectedPlaylist}
                refreshPlaylists={api.refreshPlaylists}
                getPlaylistTrackIds={api.getPlaylistTrackIds}
                deselectPlaylist={deselectPlaylist}
                getTrackById={api.getTrackById}
              ></PlaylistPage>
            ) : null}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
export default App;
