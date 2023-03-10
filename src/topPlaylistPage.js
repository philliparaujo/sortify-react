import { SlowMotionVideo, VolumeDown } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Slider,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export function TopPlaylistPage({
  url,
  title,
  displayName,
  sortedTracks,
  saveDisabled,
  generateSortedPlaylist,
  addBucket,
  removeEmptyBucket,
  deletePlaylist,
  id,
  notifyVolume,
  initialVolume,
  notifySpeed,
  initialSpeed,
}) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Tooltip title="Open in Spotify" placement="bottom" followCursor>
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          variant="h3"
          sx={{ fontWeight: "medium" }}
        >
          {title}
        </Link>
      </Tooltip>

      <Typography variant="h6">{displayName}</Typography>

      <Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenDialog(true)}
        >
          Delete playlist
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            generateSortedPlaylist(sortedTracks);
          }}
          disabled={saveDisabled}
        >
          Save
        </Button>
      </Box>
      <Box>
        <Button
          variant="contained"
          onClick={() => {
            addBucket(Date.now());
          }}
        >
          Add bucket
        </Button>
        <Button variant="contained" onClick={removeEmptyBucket}>
          Remove empty bucket
        </Button>
      </Box>

      <div style={{ display: "inline-flex", flexDirection: "row" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: 4,
            paddingRight: 16,
          }}
        >
          <Tooltip title="Playback speed">
            <SlowMotionVideo />
          </Tooltip>

          <Slider
            defaultValue={initialSpeed}
            step={0.25}
            marks
            min={0.5}
            max={2.0}
            sx={{ width: 200 }}
            onChange={(e) => notifySpeed(e.target.value)}
            valueLabelDisplay="auto"
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: 4,
            paddingLeft: 16,
          }}
        >
          <Tooltip title="Volume">
            <VolumeDown />
          </Tooltip>

          <Slider
            defaultValue={initialVolume}
            step={0.01}
            min={0}
            max={0.5}
            sx={{ width: 200 }}
            onChange={(e) => notifyVolume(e.target.value)}
          />
        </div>
      </div>

      {/* Delete playlist dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete {title}?</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              deletePlaylist(id);
            }}
          >
            Yes
          </Button>
          <Button onClick={() => setOpenDialog(false)}>No</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
