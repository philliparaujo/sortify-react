import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert"; // confirmAlert JS
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

/* props = {playlist: ...,
            getPlaylistTracks: (from api),
            refreshPlaylists: (from api) */
export function PlaylistPage({
  playlist,
  getPlaylistTrackIds,
  getTrackById,
  updatePlaylistOrder,
  deletePlaylist,
}) {
  const [bucketPlaylistIds, setBucketPlaylistIds] = useState([]);
  const [bucketTracks, setBucketTracks] = useState({});
  const [tracks, setTracks] = useState([]);
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

  /* Re-render on playlist select */
  useEffect(() => {
    setBucketPlaylistIds([]);
    setBucketTracks({});
  }, [id]);

  useEffect(() => {
    if (bucketPlaylistIds.length === 0) {
      addBucket(id);
    }
  }, [bucketPlaylistIds]);

  useEffect(() => {
    setTracks(
      Object.values(bucketTracks)
        .flat()
        .filter((track) => track.localeCompare("#") !== 0)
    );
  }, [bucketTracks]);

  /* Useful playlistPage-only functions */
  const addBucket = (playlistId) => {
    setBucketPlaylistIds((oldBucketPlaylistIds) => {
      return oldBucketPlaylistIds.concat(playlistId);
    });

    const newBucketTrack = { [newId]: [] };
    setBucketTracks((oldBucketTracks) => {
      return {
        ...oldBucketTracks,
        ...newBucketTrack,
      };
    });

    setNewId(newId + 1);
  };

  const removeEmptyBucket = () => {
    const idArray = Object.keys(bucketTracks);
    const maxId = Math.max.apply(Math, idArray);

    // if only one bucket present, keep it
    if (idArray.length <= 1) return;

    var removed = false;

    for (let i = maxId; i > 0; i--) {
      if (bucketTracks[i] && bucketTracks[i].length === 0 && !removed) {
        setBucketPlaylistIds((currentBucketIds) => {
          const newBucketIds = [...currentBucketIds];
          newBucketIds[i] = "#";
          return newBucketIds;
        });

        setBucketTracks((currentBucketTracks) => {
          const newBucketTracks = { ...currentBucketTracks };
          newBucketTracks[i] = "#";
          return newBucketTracks;
        });

        removed = true;
      }
    }
  };

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

      setBucketTracks((currentBucketTracks) => {
        const newBucketTracks = { ...currentBucketTracks, ...newTracks };
        return newBucketTracks;
      });
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
    console.log(tracks);
  };

  return (
    <Box>
      <Typography variant="h3" sx={{ fontWeight: "medium" }}>
        {title}
      </Typography>
      <Typography variant="h6">{displayName}</Typography>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpenDialog(true)}
      >
        Delete playlist
      </Button>
      <Button variant="contained" onClick={removeEmptyBucket}>
        Remove empty bucket
      </Button>
      <Button variant="contained" onClick={() => addBucket()}>
        Add bucket
      </Button>
      <Button variant="contained" color="secondary" onClick={saveSongs}>
        Save
      </Button>

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
        bucketIds={bucketPlaylistIds}
        handlePlay={handlePlay}
        handlePause={handlePause}
        getTrackById={getTrackById}
        getPlaylistTrackIds={getPlaylistTrackIds}
        handleTracksUpdate={handleTracksUpdate}
      ></SuperBucket>
    </Box>
  );
}
