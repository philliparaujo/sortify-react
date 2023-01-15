import "./App.css";
import React, { createContext, useState } from "react";
import { useApi } from "./spotify.js";
import { PlaylistPage } from "./playlistPage";
import { NavBar } from "./navBar";
import { Menu } from "./menu";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  Box,
  Button,
  createTheme,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { useMemo } from "react";
import { Hearing } from "@mui/icons-material";
import { Sort } from "@mui/icons-material";
import { Save } from "@mui/icons-material";
import { Homepage } from "./homepage";

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

  // TODO: organize imports
  // TODO: get playlist update to work on track dragg
  // TODO: change navbar buttons to accordion
  // TODO: fix spotify.js siteRoot stuff

  // TODO: handle errors for: not being on dev group
  // not being added to redirect uris on spotify dev page
  // charAt error on first login (menu)
  // fix spotify add songs

  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <NavBarVisible.Provider value={{ visible, setVisible }}>
          <Box className="App">
            <PlaylistIndex.Provider value={{ playlistIndex, setPlaylistIndex }}>
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
                  updatePlaylistOrder={api.updatePlaylistOrder}
                  deletePlaylist={api.deletePlaylist}
                  createPlaylist={api.createPlaylist}
                  addSongToPlaylist={api.addSongToPlaylist}
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
