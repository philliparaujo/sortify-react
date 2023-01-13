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
  Typography,
} from "@mui/material";
import { useCallback } from "react";

export function PlaylistPage({
  playlist,
  getPlaylistTrackIds,
  getTrackById,
  updatePlaylistOrder,
  deletePlaylist,
}) {
  const [bucketTracks, setBucketTracks] = useState({}); // hash of buckets & tracks
  const [pauseCurrentTrack, setPauseCurrentTrack] = useState();
  const [newId, setNewId] = useState(0);
  const [playlistUpdates, setPlaylistUpdates] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const id = playlist.id;
  const title = playlist.name;
  const displayName = playlist.owner.display_name;
  const numTracks = playlist.tracks.total;
  // const url = playlist.external_urls.spotify;
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
  }, [id]);

  /* Add bucket if currently no bucket (should only trigger on id change) */
  useEffect(() => {
    if (Object.keys(bucketTracks).length === 0) {
      addBucket();
    }
  }, [bucketTracks, addBucket]);

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

  const updatePlaylist = (range_start, insert_before) => {
    // console.log("PLAYLIST UPDATES", range_start, insert_before);

    if (range_start >= numTracks) {
      throw new Error("range start too large");
    }
    if (insert_before > numTracks) {
      throw new Error("insert position too large");
    }

    return updatePlaylistOrder(id, range_start, insert_before);
  };

  const saveSongs = () => {
    const sortedTracks = Object.values(bucketTracks)
      .flat()
      .filter((track) => track.localeCompare("#") !== 0);

    console.log(sortedTracks);
  };

  return (
    <Box>
      <Typography variant="h3" sx={{ fontWeight: "medium" }}>
        {title}
      </Typography>
      <Typography variant="h6">{displayName}</Typography>

      <Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenDialog(true)}
        >
          Delete playlist
        </Button>
        <Button variant="contained" color="secondary" onClick={saveSongs}>
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
      ></SuperBucket>
    </Box>
  );
}
