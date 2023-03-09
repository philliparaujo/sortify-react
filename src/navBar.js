import { useContext, useEffect, useState } from "react";
import { NavBarVisible, PlaylistIndex } from "./App.js";

import {
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";

export function NavBar({
  isLoggedIn,
  playlists,
  selectedPlaylist,
  deselectPlaylist,
  refreshPlaylists,
  createPlaylist,
  addSongToPlaylist,
}) {
  const { visible } = useContext(NavBarVisible);
  const { setPlaylistIndex } = useContext(PlaylistIndex);
  const [lastPlaylistId, setLastPlaylistId] = useState(undefined);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newSongInput, setNewSongInput] = useState("");

  useEffect(() => {
    if (lastPlaylistId && selectedPlaylist) {
      setPlaylistIndex(getPlaylistIndex(lastPlaylistId));
    }
  }, [playlists]);

  const addSongToPlaylistNew = (playlistId, title) => {
    if (selectedPlaylist === null) {
      throw new Error("No playlist selected");
    }
    addSongToPlaylist(playlistId, title);
  };

  const getPlaylistIndex = (playlistId) => {
    for (let i = 0; i < playlists.length; i++) {
      if (playlists[i].id === playlistId) {
        return i;
      }
    }

    console.log(`Playlist index not found for ${playlistId}`);
    return 0;
  };

  const drawerWidth = 300;

  return (
    <Box sx={{ display: "flex" }} style={{ background: "transparent" }}>
      <CssBaseline enableColorScheme />
      {isLoggedIn && playlists && visible ? (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open
        >
          <Divider />
          <List>
            <ListItem key={"H1"} disablePadding>
              <ListItemButton onClick={refreshPlaylists}>
                <ListItemText primary={"Refresh playlists"} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"H2"} disablePadding>
              <ListItemButton
                disabled={!Boolean(selectedPlaylist)}
                onClick={deselectPlaylist}
              >
                <ListItemText primary={"Deselect playlist"} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"H3"} disablePadding>
              <ListItemButton
                disabled={!Boolean(newPlaylistName)}
                onClick={() => {
                  createPlaylist(newPlaylistName);
                  setNewPlaylistName("");
                }}
              >
                <ListItemText primary={"Create playlist"} />
              </ListItemButton>
              <TextField
                style={{ paddingRight: 15 }}
                size="small"
                variant="outlined"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
              />
            </ListItem>
            <ListItem key={"H4"} disablePadding>
              <ListItemButton
                disabled={!Boolean(newSongInput)}
                onClick={() => {
                  addSongToPlaylistNew(selectedPlaylist.id, newSongInput);
                  setNewSongInput("");
                }}
              >
                <ListItemText primary={"Add song"} />
              </ListItemButton>
              <TextField
                style={{ paddingRight: 15 }}
                size="small"
                variant="outlined"
                value={newSongInput}
                onChange={(e) => setNewSongInput(e.target.value)}
              />
            </ListItem>
          </List>

          <Divider />

          <List>
            {playlists.map((playlist, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    deselectPlaylist();
                    setPlaylistIndex(index);
                    setLastPlaylistId(playlist.id);
                  }}
                >
                  <ListItemText primary={playlist.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      ) : null}
    </Box>
  );
}
