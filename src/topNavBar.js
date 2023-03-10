import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { useState } from "react";

export function TopNavBar({
  refreshPlaylists,
  selectedPlaylist,
  deselectPlaylist,
  createPlaylist,
  addSongToPlaylistNew,
}) {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newSongInput, setNewSongInput] = useState("");

  return (
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
  );
}
