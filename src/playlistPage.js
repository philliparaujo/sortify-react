import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert"; // confirmAlert JS
import "react-confirm-alert/src/react-confirm-alert.css"; // confirmAlert CSS
import { Bucket } from "./Bucket";
import { SuperBucket } from "./SuperBucket";
import { Track } from "./track";

/* props = {playlist: ...,
            getPlaylistTracks: (from api),
            refreshPlaylists: (from api) */
export function PlaylistPage({
  playlist,
  refreshPlaylists,
  getPlaylistTrackIds,
  getTrackById,
}) {
  const [bucketIds, setBucketIds] = useState([]);
  const [trackIds, setTrackIds] = useState([]);
  const [ready, setReady] = useState(false);
  const [pauseCurrentTrack, setPauseCurrentTrack] = useState();

  const id = playlist.id;
  const title = playlist.name;
  const displayName = playlist.owner.display_name;
  // const url = playlist.external_urls.spotify;
  // const image = playlist.images;
  // const userId = playlist.owner.id;
  // const numTracks = playlist.tracks.total;

  useEffect(() => {
    setBucketIds([{ id: Date.now(), playlistId: id }]);
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
    const bucket = document.createElement("bucket");

    // setup new bucket on creation
    const page = document.querySelector(".superBucket");
    page.appendChild(bucket);

    const newBucketId = { id: Date.now(), playlistId: undefined };
    setBucketIds((currentBuckets) => [...currentBuckets, newBucketId]);
  };
  const removeEmptyBucket = () => {
    const buckets = document.querySelectorAll(".bucket");
    var removed = false;
    if (buckets.length === 1) return;
    buckets.forEach((bucket) => {
      if (!bucket.firstChild && !removed) {
        bucket.remove();
        removed = true;
      }
    });
  };

  /* Re-render on playlist select */
  useEffect(() => {
    setReady(false);

    getPlaylistTrackIds(id)
      .then((result) => setTrackIds(result))
      .then(() => setReady(true));
  }, [getPlaylistTrackIds, id]);

  /* Handling track dragging */
  // const getDragAfterElement = (bucket, y) => {
  //   const draggableElements = [
  //     ...bucket.querySelectorAll(".track:not(.dragging)"),
  //   ];

  //   return draggableElements.reduce(
  //     (closest, child) => {
  //       const box = child.getBoundingClientRect();
  //       const offset = y - box.top - box.height / 2;
  //       if (offset < 0 && offset > closest.offset) {
  //         return { offset: offset, element: child };
  //       } else {
  //         return closest;
  //       }
  //     },
  //     { offset: Number.NEGATIVE_INFINITY }
  //   ).element;
  // };

  // on render, setup all buckets

  // useEffect(() => {
  //   const buckets = document.querySelectorAll(".bucket");
  //   buckets.forEach((bucket) => {
  //     // bucket.addEventListener("dragover", (e) => {
  //     //   handleTrackDrag(e, bucket);
  //     // });
  //     bucket.ondragstart = (e) => e.target.classList.add("dragging");
  //     bucket.ondragend = (e) => e.target.classList.remove("dragging");
  //     bucket.draggable = true;
  //   });
  // });

  /* Handling bucket dragging */
  // const getBucketDragAfterElement = (superBucket, x) => {
  //   const draggableElements = [
  //     ...superBucket.querySelectorAll(".bucket:not(.dragging)"),
  //   ];

  //   return draggableElements.reduce(
  //     (closest, child) => {
  //       const box = child.getBoundingClientRect();
  //       const offset = x - box.left - box.width / 2;
  //       if (offset < 0 && offset > closest.offset) {
  //         return { offset: offset, element: child };
  //       } else {
  //         return closest;
  //       }
  //     },
  //     { offset: Number.NEGATIVE_INFINITY }
  //   ).element;
  // };

  // const handleBucketDrag = (e, superBucket) => {
  //   if (!document.querySelector(".track.dragging")) {
  //     e.preventDefault();
  //     const afterElement = getBucketDragAfterElement(superBucket, e.clientX);
  //     const draggable = document.querySelector(".bucket.dragging");
  //     if (afterElement == null) {
  //       superBucket.appendChild(draggable);
  //     } else {
  //       superBucket.insertBefore(draggable, afterElement);
  //     }
  //   }
  // };

  // on render, setup all superBuckets (only one)
  useEffect(() => {
    const superBucket = document.querySelectorAll(".superBucket");
    superBucket.forEach((superBucket) => {
      // superBucket.addEventListener("dragover", (e) => {
      //   handleBucketDrag(e, superBucket);
      // });
    });
  });

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

  return ready ? (
    <div>
      <h1>{title}</h1>
      <p>{displayName}</p>
      <button onClick={deletePlaylist}>Delete playlist</button>
      <button onClick={addBucket}>Add bucket</button>
      <button onClick={removeEmptyBucket}>Remove empty bucket</button>
      <SuperBucket
        bucketIds={bucketIds}
        trackIds={trackIds}
        handlePlay={handlePlay}
        handlePause={handlePause}
        getTrackById={getTrackById}
      ></SuperBucket>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
