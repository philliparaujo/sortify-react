import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert"; // confirmAlert JS
import "react-confirm-alert/src/react-confirm-alert.css"; // confirmAlert CSS
import { SuperBucket } from "./SuperBucket";

/* props = {playlist: ...,
            getPlaylistTracks: (from api),
            refreshPlaylists: (from api) */
export function PlaylistPage({
  playlist,
  refreshPlaylists,
  getPlaylistTrackIds,
  getTrackById,
}) {
  const [bucketIds, setBucketIds] = useState({});
  const [bucketSizes, setBucketSizes] = useState({});
  const [bucketTracks, setBucketTracks] = useState({});
  const [pauseCurrentTrack, setPauseCurrentTrack] = useState();

  const id = playlist.id;
  const title = playlist.name;
  const displayName = playlist.owner.display_name;
  // const url = playlist.external_urls.spotify;
  // const image = playlist.images;
  // const userId = playlist.owner.id;
  // const numTracks = playlist.tracks.total;

  /* Re-render on playlist select */
  useEffect(() => {
    const firstId = Date.now();
    setBucketIds({ [firstId]: id });
    setBucketSizes({ [firstId]: 0 });
    setBucketTracks({ [firstId]: getPlaylistTrackIds(id) });
  }, [id]);

  const deletePlaylist = () => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    confirmAlert({
      title: `Delete ${title}?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            return fetch(
              `https://api.spotify.com/v1/` + `playlists/${id}/followers`,
              requestOptions
            ).then(refreshPlaylists);
          },
        },
        { label: "No" },
      ],
    });
  };
  const addBucket = () => {
    const newId = Date.now();
    const newBucketId = { [newId]: undefined };
    setBucketIds({
      ...bucketIds,
      ...newBucketId,
    });
    const newBucketSize = { [newId]: 0 };
    setBucketSizes({
      ...bucketSizes,
      ...newBucketSize,
    });
    const newBucketTrack = { [newId]: [] };
    setBucketTracks({
      ...bucketTracks,
      ...newBucketTrack,
    });
  };
  const removeEmptyBucket = () => {
    const idArray = Object.keys(bucketIds);
    const sizeArray = Object.values(bucketSizes);
    const size = idArray.length;

    // if only one bucket present, keep it
    if (Object.keys(bucketIds).length === 1) return;

    var removed = false;

    for (let i = size - 1; i > 0; i--) {
      if (sizeArray[i] === 0 && !removed) {
        setBucketIds((currentBucketIds) => {
          const newBucketIds = { ...currentBucketIds };
          delete newBucketIds[idArray[i]];
          return newBucketIds;
        });

        setBucketSizes((currentBucketSizes) => {
          const newBucketSizes = { ...currentBucketSizes };
          delete newBucketSizes[idArray[i]];
          return newBucketSizes;
        });

        setBucketTracks((currentBucketTracks) => {
          const newBucketTracks = { ...currentBucketTracks };
          delete newBucketTracks[idArray[i]];
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

  const handleSizeUpdate = (bucketId, size) => {
    const newSize = { [bucketId]: size };

    setBucketSizes((currentBucketIds) => {
      const newBucketIds = { ...currentBucketIds, ...newSize };
      return newBucketIds;
    });
  };

  const handleTracksUpdate = (bucketId, tracks) => {
    const newTracks = { [bucketId]: tracks };

    setBucketTracks((currentBucketTracks) => {
      const newBucketTracks = { ...currentBucketTracks, ...newTracks };
      return newBucketTracks;
    });
  };

  const [triggerBucketPause, setTriggerBucketPause] = useState(false);
  const pauseAllBuckets = () => {
    setTriggerBucketPause((triggerPause) => !triggerPause);
  };

  return (
    <>
      <h1>{title}</h1>
      <p>{displayName}</p>
      <button onClick={deletePlaylist}>Delete playlist</button>
      <button onClick={addBucket}>Add bucket</button>
      <button
        onClick={removeEmptyBucket}
        disabled={Object.keys(bucketIds).length < 2}
      >
        Remove empty bucket
      </button>
      <button onClick={pauseAllBuckets}>Pause all</button>
      <SuperBucket
        bucketIds={bucketIds}
        handlePlay={handlePlay}
        handlePause={handlePause}
        getTrackById={getTrackById}
        getPlaylistTrackIds={getPlaylistTrackIds}
        handleSizeUpdate={handleSizeUpdate}
        handleTracksUpdate={handleTracksUpdate}
        triggerBucketPause={triggerBucketPause}
      ></SuperBucket>
    </>
  );
}
