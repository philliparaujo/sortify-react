import React, { useEffect, useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // confirmAlert CSS
import { SuperBucket } from "./SuperBucket";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Link,
  Slider,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback } from "react";

import { SlowMotionVideo, VolumeDown } from "@mui/icons-material";

export function PlaylistPage({
  playlist,
  getPlaylistTrackIds,
  getTrackById,
  deletePlaylist,
  createPlaylist,
  addSongToPlaylist,
  addSongUrisToPlaylist,
}) {
  const [bucketTracks, setBucketTracks] = useState({}); // hash of buckets & tracks
  const [originalTracks, setOriginalTracks] = useState([]); // array of all tracks on playlist load
  const [sortedTracks, setSortedTracks] = useState([]); // array of all tracks
  const [pauseCurrentTrack, setPauseCurrentTrack] = useState();
  const [newId, setNewId] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(0.1);

  const id = playlist.id;
  const title = playlist.name;
  const displayName = playlist.owner.display_name;
  const url = playlist.external_urls.spotify;
  // const numTracks = playlist.tracks.total;
  // const image = playlist.images;
  // const userId = playlist.owner.id;

  const bucketIdWithPlaylistId = 0;

  /* Useful playlistPage-only functions */
  const addBucket = useCallback(() => {
    const newBucketTrack = { [newId]: [] };
    setBucketTracks((oldBucketTracks) => {
      return {
        ...oldBucketTracks,
        ...newBucketTrack,
      };
    });

    setNewId(newId + 1);
  }, [newId]);

  const removeEmptyBucket = () => {
    const arrayOfBucketIds = Object.keys(bucketTracks);
    arrayOfBucketIds.reverse();

    var removed = false;

    arrayOfBucketIds.forEach((bucketId) => {
      if (!removed && bucketTracks[bucketId].length === 0) {
        setBucketTracks((oldTracks) => {
          const newTracks = { ...oldTracks };
          delete newTracks[bucketId];
          return newTracks;
        });
        removed = true;
      }
    });
  };

  /* Re-render on playlist select */
  useEffect(() => {
    setBucketTracks({});
    setNewId(0);
    getPlaylistTrackIds(id).then((result) => setOriginalTracks(result));
  }, [id, getPlaylistTrackIds]);

  /* Add bucket if currently no bucket (should only trigger on id change) */
  useEffect(() => {
    if (Object.keys(bucketTracks).length === 0) {
      addBucket();
    }
  }, [bucketTracks, addBucket]);

  /* Keeps sorted tracks updated */
  useEffect(() => {
    setSortedTracks(Object.values(bucketTracks).flat());
  }, [bucketTracks]);

  /* Handling memory of playing songs */
  const handlePlay = (pauseMe) => {
    setPauseCurrentTrack((currentPauseMe) => {
      if (currentPauseMe) {
        currentPauseMe();
      }
      return pauseMe;
    });
  };

  const handlePause = () => {
    setPauseCurrentTrack(undefined);
  };

  /* Handling state of tracks in bucket */
  const handleTracksUpdate = React.useCallback(
    (bucketId, tracks) => {
      const newTracks = { [bucketId]: tracks };

      setBucketTracks((currentBucketTracks) => ({
        ...currentBucketTracks,
        ...newTracks,
      }));
    },
    [setBucketTracks]
  );

  async function generateSortedPlaylist(sortedTracks) {
    createPlaylist(`[sorted] ${title}`).then(async (result) =>
      addSongUrisToPlaylist(result.id, sortedTracks)
    );
  }

  const areArraysEqual = (array1, array2) => {
    if (array1.length !== array2.length) {
      return false;
    }
    for (let i = 0; i < array1.length; i++) {
      if (array1[i].localeCompare(array2[i]) !== 0) {
        return false;
      }
    }
    return true;
  };

  return (
    <Box>
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
          disabled={areArraysEqual(originalTracks, sortedTracks)}
        >
          Save
        </Button>
      </Box>
      <Box>
        <Button variant="contained" onClick={addBucket}>
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
            defaultValue={1.0}
            step={0.25}
            marks
            min={0.5}
            max={2.0}
            value={speed}
            sx={{ width: 200 }}
            onChange={(e) => setSpeed(e.target.value)}
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
            defaultValue={0.1}
            step={0.01}
            min={0}
            max={0.5}
            value={volume}
            sx={{ width: 200 }}
            onChange={(e) => setVolume(e.target.value)}
          />
        </div>
      </div>

      <Divider />

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

      <SuperBucket
        handlePlay={handlePlay}
        handlePause={handlePause}
        getTrackById={getTrackById}
        getPlaylistTrackIds={getPlaylistTrackIds}
        handleTracksUpdate={handleTracksUpdate}
        bucketIds={Object.keys(bucketTracks)}
        bucketIdWithPlaylistId={bucketIdWithPlaylistId}
        playlistId={id}
        speed={speed}
        volume={volume}
      ></SuperBucket>
    </Box>
  );
}
