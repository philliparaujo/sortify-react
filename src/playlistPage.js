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
  updatePlaylistOrder,
}) {
  const [bucketIds, setBucketIds] = useState({});
  const [bucketTracks, setBucketTracks] = useState({});
  const [pauseCurrentTrack, setPauseCurrentTrack] = useState();
  const [newId, setNewId] = useState(1);
  const [playlistUpdates, setPlaylistUpdates] = useState([]);

  const id = playlist.id;
  const title = playlist.name;
  const displayName = playlist.owner.display_name;
  const numTracks = playlist.tracks.total;
  // const url = playlist.external_urls.spotify;
  // const image = playlist.images;
  // const userId = playlist.owner.id;

  /* Re-render on playlist select */
  useEffect(() => {
    setBucketIds({});
    setBucketTracks({});
    addBucket(id);
  }, [id]);

  /* Useful playlistPage-only functions */
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

  const addBucket = (playlistId) => {
    const newBucketId = { [newId]: playlistId };
    setBucketIds((oldBucketIds) => {
      return { ...oldBucketIds, ...newBucketId };
    });
    const newBucketTrack = { [newId]: [] };
    setBucketTracks((oldBucketTracks) => {
      return {
        ...oldBucketTracks,
        ...newBucketTrack,
      };
    });

    setNewId((oldId) => oldId + 1);
  };

  const removeEmptyBucket = () => {
    const idArray = Object.keys(bucketIds);
    const sizeArray = Object.values(bucketTracks).map(
      (tracks) => tracks.length
    );
    const numTracks = idArray.length;

    // if only one bucket present, keep it
    if (Object.keys(bucketIds).length === 1) return;

    var removed = false;

    for (let i = numTracks - 1; i > 0; i--) {
      if (sizeArray[i] === 0 && !removed) {
        setBucketIds((currentBucketIds) => {
          const newBucketIds = { ...currentBucketIds };
          delete newBucketIds[idArray[i]];
          return newBucketIds;
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

  const updatePlaylist = (playlistUpdates) => {
    const inputArray = playlistUpdates.split(",");
    if (inputArray.length % 2 === 1) {
      throw new Error("odd number of inputs in updatePlaylist");
    }
    if (!inputArray.every((value) => value <= numTracks)) {
      throw new Error("at least one input WAY too large");
    }

    var newArray = [];
    for (let i = 0; i < inputArray.length / 2; i++) {
      var temp = inputArray[2 * i];
      var temp2 = inputArray[2 * i + 1];
      newArray.push([temp, temp2]);
    }
    if (!newArray.every((values) => values[0] < numTracks)) {
      throw new Error("at least one input too large");
    }

    var result = Promise.resolve();
    newArray.forEach((values) => {
      result = result.then(() => {
        // console.log(values[0], values[1]);
        return updatePlaylistOrder(
          id,
          parseInt(values[0]),
          parseInt(values[1])
        );
      });
    });
  };

  return (
    <>
      <h1>{title}</h1>
      <p>{displayName}</p>
      <button onClick={deletePlaylist}>Delete playlist</button>
      <button
        onClick={removeEmptyBucket}
        disabled={Object.keys(bucketIds).length < 2}
      >
        Remove empty bucket
      </button>
      <button onClick={() => addBucket()}>Add bucket</button>
      <button
        onClick={() => {
          updatePlaylist(playlistUpdates);
        }}
      >
        Update playlist order
      </button>
      <input
        type="text"
        size="30"
        value={playlistUpdates}
        onChange={(e) => setPlaylistUpdates(e.target.value)}
      ></input>
      <SuperBucket
        bucketIds={bucketIds}
        handlePlay={handlePlay}
        handlePause={handlePause}
        getTrackById={getTrackById}
        getPlaylistTrackIds={getPlaylistTrackIds}
        handleTracksUpdate={handleTracksUpdate}
      ></SuperBucket>
    </>
  );
}
