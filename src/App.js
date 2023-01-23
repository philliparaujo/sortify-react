import React, { createContext, useState } from "react";
import "./App.css";
import { Menu } from "./menu";
import { NavBar } from "./navBar";
import { PlaylistPage } from "./playlistPage";
import { useApi } from "./spotify.js";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { ThemeProvider } from "@emotion/react";
import { Box, createTheme } from "@mui/material";
import { useMemo } from "react";
import { Homepage } from "./homepage";
import { useEffect } from "react";

export const PlaylistIndex = createContext();
export const NavBarVisible = createContext();
export const FastMode = createContext();

export function App() {
  const api = useApi();
  const [playlistIndex, setPlaylistIndex] = useState();
  const [visible, setVisible] = useState(true);
  const [fastMode, setFastMode] = useState(true);

  const deselectPlaylist = () => {
    setPlaylistIndex(undefined);
  };

  const selectedPlaylist =
    api.isLoggedIn && playlistIndex !== undefined
      ? api.playlists[playlistIndex]
      : null;

  const [lightMode, setLightMode] = useState(true);
  const toggleTheme = () => {
    setLightMode((mode) => !mode);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: lightMode ? "light" : "dark",
        },
      }),
    [lightMode]
  );

  // TODO: change playlistPage to take in the minimum playlist info as props
  // TODO: change URIComponent to URL object & query params in spotify.js searchByTitle
  // TODO: handle duplicate song ids

  // TODO: handle errors for: not being on dev group
  // not being added to redirect uris on spotify dev page
  // charAt error on first login (fixed?), fix siteRoot stuff (fixed?)
  // fix playing same song after 30 seconds

  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <NavBarVisible.Provider value={{ visible, setVisible }}>
          <FastMode.Provider value={{ fastMode, setFastMode }}>
            <Box className="App">
              <PlaylistIndex.Provider
                value={{ playlistIndex, setPlaylistIndex }}
              >
                <NavBar
                  isLoggedIn={api.isLoggedIn}
                  playlists={api.playlists}
                  selectedPlaylist={selectedPlaylist}
                  deselectPlaylist={deselectPlaylist}
                  refreshPlaylists={api.refreshPlaylists}
                  createPlaylist={api.createPlaylist}
                  addSongToPlaylist={api.addSongToPlaylist}
                />
              </PlaylistIndex.Provider>

              <Box className="App-body">
                {api.isLoggedIn ? (
                  <Menu
                    isLoggedIn={api.isLoggedIn}
                    name={api.name}
                    profile={api.profile}
                    login={api.login}
                    logout={api.logout}
                    toggleTheme={toggleTheme}
                  />
                ) : (
                  <Homepage login={api.login} />
                )}

                {api.isLoggedIn && selectedPlaylist ? (
                  <PlaylistPage
                    playlist={selectedPlaylist}
                    getPlaylistTrackIds={api.getPlaylistTrackIds}
                    getTrackById={api.getTrackById}
                    deletePlaylist={api.deletePlaylist}
                    createPlaylist={api.createPlaylist}
                    addSongToPlaylist={api.addSongToPlaylist}
                    addSongUrisToPlaylist={api.addSongUrisToPlaylist}
                    fastMode={fastMode}
                  />
                ) : null}
              </Box>
            </Box>
          </FastMode.Provider>
        </NavBarVisible.Provider>
      </DndProvider>
    </ThemeProvider>
  );
}
export default App;
