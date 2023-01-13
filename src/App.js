import "./App.css";
import React, { createContext, useState } from "react";
import { useApi } from "./spotify.js";
import { PlaylistPage } from "./playlistPage";
import { NavBar } from "./navBar";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Box, Typography } from "@mui/material";

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

  // TODO: organize imports
  // TODO: finish adding MUI
  // TODO: get playlist update to work on track dragg

  return (
    <DndProvider backend={HTML5Backend}>
      <Box className="App">
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

        <Box className="App-body">
          <Typography
            sx={{ fontWeight: "medium" }}
            variant="h1"
            bgcolor="primary.dark"
            color="primary.contrastText"
          >
            Sortify
          </Typography>

          <Box className="content">
            {selectedPlaylist ? (
              <PlaylistPage
                playlist={selectedPlaylist}
                getPlaylistTrackIds={api.getPlaylistTrackIds}
                getTrackById={api.getTrackById}
                updatePlaylistOrder={api.updatePlaylistOrder}
                deletePlaylist={api.deletePlaylist}
              ></PlaylistPage>
            ) : null}
          </Box>
        </Box>
      </Box>
    </DndProvider>
  );
}
export default App;
