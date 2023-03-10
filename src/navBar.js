import "./wdyr";

import {
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useContext, useEffect, useState } from "react";
import { NavBarVisible, PlaylistIndex } from "./App.js";
import { TopNavBar } from "./topNavBar.js";

export function NavBar({
  isLoggedIn,
  playlists,
  selectedPlaylist,
  deselectPlaylist,
  refreshPlaylists,
  createPlaylist,
  addSongToPlaylist,
  open,
}) {
  const { visible } = useContext(NavBarVisible);
  const { setPlaylistIndex } = useContext(PlaylistIndex);
  const [lastPlaylistId, setLastPlaylistId] = useState(undefined);

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
      {isLoggedIn && playlists && open ? (
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

          <TopNavBar
            refreshPlaylists={refreshPlaylists}
            selectedPlaylist={selectedPlaylist}
            deselectPlaylist={deselectPlaylist}
            createPlaylist={createPlaylist}
            addSongToPlaylistNew={addSongToPlaylistNew}
          />

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

NavBar.whyDidYouRender = true;
