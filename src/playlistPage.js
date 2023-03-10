import "./wdyr";

import { Box, Divider } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // confirmAlert CSS
import { Subscription } from "./subscription";
import { SuperBucket } from "./SuperBucket";
import { TopPlaylistPage } from "./topPlaylistPage";

var pauseCurrentTrack;
var setPauseCurrentTrack = (setterOrValue) => {
  if (setterOrValue instanceof Function) {
    pauseCurrentTrack = setterOrValue(pauseCurrentTrack);
  } else {
    pauseCurrentTrack = setterOrValue;
  }
};

export function PlaylistPage({
  playlist,
  getPlaylistTrackIds,
  getTrackById,
  deletePlaylist,
  createPlaylist,
  addSongUrisToPlaylist,
}) {
  const [bucketTracks, setBucketTracks] = useState({}); // hash of buckets & tracks
  const [originalTracks, setOriginalTracks] = useState([]); // array of all tracks on playlist load
  const [sortedTracks, setSortedTracks] = useState([]); // array of all tracks
  const bucketIds = Object.keys(bucketTracks);

  const id = playlist.id;
  const title = playlist.name;
  const displayName = playlist.owner.display_name;
  const url = playlist.external_urls.spotify;
  // const numTracks = playlist.tracks.total;
  // const image = playlist.images;
  // const userId = playlist.owner.id;

  var bucketIdWithPlaylistId = 0;

  const [volumeSubs] = useState(new Subscription(0.1));
  const [speedSubs] = useState(new Subscription(1.0));

  /* Useful playlistPage-only functions */
  const addBucket = (newId) => {
    setBucketTracks((oldTracks) => {
      const newTracks = { ...oldTracks };
      newTracks[newId] = [];
      return newTracks;
    });
  };

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
    if (!areObjectsEqual(bucketTracks, {})) {
      setBucketTracks({});
    }
    getPlaylistTrackIds(id).then((result) =>
      setOriginalTracks((result) => {
        if (areArraysEqual(originalTracks, result)) {
          return originalTracks;
        }
        return result;
      })
    );
  }, [id, getPlaylistTrackIds]);

  /* Add bucket if currently no bucket (should only trigger on id change) */
  useEffect(() => {
    if (Object.keys(bucketTracks).length === 0) {
      addBucket(bucketIdWithPlaylistId);
    }
  }, [bucketTracks, bucketIdWithPlaylistId]);

  /* Keeps sorted tracks updated */
  useEffect(() => {
    const newList = Object.values(bucketTracks).flat();
    if (!areArraysEqual(newList, sortedTracks)) {
      setSortedTracks(newList);
    }
  }, [bucketTracks, sortedTracks]);

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
        const result = {
          ...currentBucketTracks,
          ...newTracks,
        };

        if (areObjectsEqual(result, currentBucketTracks)) {
          return currentBucketTracks;
        }
        return result;
      });
    },
    [setBucketTracks]
  );

  useEffect(() => {}, [bucketTracks]);

  async function generateSortedPlaylist(sortedTracks) {
    createPlaylist(`[sorted] ${title}`).then(async (result) =>
      addSongUrisToPlaylist(result.id, sortedTracks)
    );
  }

  function areArraysEqual(array1, array2) {
    if (array1.length !== array2.length) {
      return false;
    }
    for (let i = 0; i < array1.length; i++) {
      if (
        array1[i].toString === undefined ||
        array2[i].toString === undefined
      ) {
        return false;
      }

      if (array1[i].toString().localeCompare(array2[i].toString()) !== 0) {
        return false;
      }
    }
    return true;
  }

  function areObjectsEqual(object1, object2) {
    return JSON.stringify(object1) === JSON.stringify(object2);
  }

  const saveDisabled = useMemo(
    () => areArraysEqual(originalTracks, sortedTracks),
    [originalTracks, sortedTracks]
  );

  return (
    <Box>
      <TopPlaylistPage
        url={url}
        title={title}
        displayName={displayName}
        sortedTracks={sortedTracks}
        saveDisabled={saveDisabled}
        generateSortedPlaylist={generateSortedPlaylist}
        addBucket={addBucket}
        removeEmptyBucket={removeEmptyBucket}
        deletePlaylist={deletePlaylist}
        id={id}
        notifyVolume={volumeSubs.notify}
        initialVolume={volumeSubs.initialValue()}
        notifySpeed={speedSubs.notify}
        initialSpeed={speedSubs.initialValue()}
      />

      <Divider />

      <SuperBucket
        handlePlay={handlePlay}
        handlePause={handlePause}
        getTrackById={getTrackById}
        getPlaylistTrackIds={getPlaylistTrackIds}
        onTracksUpdate={handleTracksUpdate}
        bucketIds={bucketIds}
        bucketIdWithPlaylistId={bucketIdWithPlaylistId}
        playlistId={id}
        subscribeVolume={volumeSubs.add}
        unsubscribeVolume={volumeSubs.remove}
        getVolume={volumeSubs.value}
        subscribeSpeed={speedSubs.add}
        unsubscribeSpeed={speedSubs.remove}
        getSpeed={speedSubs.value}
      ></SuperBucket>
    </Box>
  );
}

PlaylistPage.whyDidYouRender = true;
