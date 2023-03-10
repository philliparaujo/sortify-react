import "./wdyr";

import { ThemeProvider } from "@emotion/react";
import { Box, createTheme } from "@mui/material";
import React, { createContext, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import { Homepage } from "./homepage";
import { Menu } from "./menu";
import { NavBar } from "./navBar";
import { PlaylistPage } from "./playlistPage";
import { useApi } from "./spotify.js";

export const PlaylistIndex = createContext();
export const NavBarVisible = createContext();

export function App() {
  const api = useApi();
  const [playlistIndex, setPlaylistIndex] = useState();
  const [visible, setVisible] = useState(true);

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
  // TODO: fix appPadding for content scrolling
  // TODO: change URIComponent to URL object & query params in spotify.js searchByTitle
  // TODO: handle duplicate song ids

  // TODO: handle errors for: not being on dev group
  // not being added to redirect uris on spotify dev page
  // charAt error on first login (menu), fix siteRoot stuff (fixed?)

  const navBarData = useMemo(
    () => ({ visible, setVisible }),
    [visible, setVisible]
  );

  const playlistIndexData = useMemo(
    () => ({ playlistIndex, setPlaylistIndex }),
    [playlistIndex, setPlaylistIndex]
  );

  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <NavBarVisible.Provider value={navBarData}>
          <Box className="App">
            <PlaylistIndex.Provider value={playlistIndexData}>
              <NavBar
                isLoggedIn={api.isLoggedIn}
                playlists={api.playlists}
                selectedPlaylist={selectedPlaylist}
                deselectPlaylist={deselectPlaylist}
                refreshPlaylists={api.refreshPlaylists}
                createPlaylist={api.createPlaylist}
                addSongToPlaylist={api.addSongToPlaylist}
                open={visible}
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
                  setVisible={setVisible}
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
                  addSongUrisToPlaylist={api.addSongUrisToPlaylist}
                />
              ) : null}
            </Box>
          </Box>
        </NavBarVisible.Provider>
      </DndProvider>
    </ThemeProvider>
  );
}
export default App;

App.whyDidYouRender = true;
