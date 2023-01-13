import { useContext, useEffect, useState } from "react";
import { PlaylistIndex } from "./App.js";

import { Box, Button, TextField, Typography } from "@mui/material";

export function NavBar({
  isLoggedIn,
  name,
  playlists,
  selectedPlaylist,
  deselectPlaylist,
  login,
  logout,
  refreshPlaylists,
  createPlaylist,
  addSongToPlaylist,
}) {
  const { setPlaylistIndex } = useContext(PlaylistIndex);
  const [playlistId, setPlaylistId] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newSongInput, setNewSongInput] = useState("");

  useEffect(() => {
    if (playlistId && selectedPlaylist) {
      setPlaylistIndex(getPlaylistIndex(playlistId));
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

  return (
    <>
      <Box className="behind-nav-bar"></Box>

      <Box className="nav-bar" bgcolor="common.white" boxShadow={2}>
        {isLoggedIn ? (
          <Box className="nav-header" boxShadow={2}>
            <Button variant="contained" color="secondary" onClick={logout}>
              Logout
            </Button>
            <Typography variant="h6">Hi, {name} </Typography>
            <Button variant="contained" onClick={refreshPlaylists}>
              Refresh playlists
            </Button>
            {playlistId ? (
              <Button variant="contained" onClick={deselectPlaylist}>
                Deselect playlist
              </Button>
            ) : (
              <Button variant="contained" disabled>
                Deselect playlist
              </Button>
            )}
            <Box>
              <Button
                variant="contained"
                onClick={() => {
                  createPlaylist(newPlaylistName);
                  setNewPlaylistName("");
                }}
              >
                Create Playlist
              </Button>
              <TextField
                size="small"
                variant="outlined"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                onClick={() => {
                  addSongToPlaylistNew(selectedPlaylist.id, newSongInput);
                  setNewSongInput("");
                }}
              >
                Add Song
              </Button>
              <TextField
                size="small"
                variant="outlined"
                value={newSongInput}
                onChange={(e) => setNewSongInput(e.target.value)}
              />
            </Box>
          </Box>
        ) : (
          <Box className="nav-header">
            <Button variant="contained" color="secondary" onClick={login}>
              Login
            </Button>
          </Box>
        )}

        <Box className="allPlaylists">
          {isLoggedIn && playlists
            ? playlists.map((playlist, index) => (
                <Box key={index}>
                  <Button
                    variant="text"
                    key={index}
                    onClick={() => {
                      deselectPlaylist();
                      setPlaylistIndex(index);
                      setPlaylistId(playlist.id);
                    }}
                  >
                    {playlist.name}
                  </Button>
                </Box>
              ))
            : null}
        </Box>
      </Box>
    </>
  );
}
