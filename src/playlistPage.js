import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert"; // confirmAlert JS
import "react-confirm-alert/src/react-confirm-alert.css"; // confirmAlert CSS
import { Track } from "./track";

/* props = {playlist: ...,
            getPlaylist: (from api),
            refreshPlaylists: (from api),
            deselectPlaylist: (from setStates)} */
export function PlaylistPage(props) {
  const [tracks, setTracks] = useState([]);
  const [ready, setReady] = useState(false);

  const id = props.playlist.id;
  const title = props.playlist.name;
  const displayName = props.playlist.owner.display_name;
  // const url = props.playlist.external_urls.spotify;
  // const image = props.playlist.images;
  // const userId = props.playlist.owner.id;
  // const numTracks = props.playlist.tracks.total;

  const refreshPlaylists = props.refreshPlaylists;
  const getPlaylist = props.getPlaylist;
  const deselectPlaylist = props.deselectPlaylist;
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
            )
              .then(refreshPlaylists)
              .then(deselectPlaylist);
          },
        },
        { label: "No" },
      ],
    });
  };

  /* Re-render on different playlist select */
  useEffect(() => {
    setReady(false);

    getPlaylist(id)
      .then((result) => result.map((item) => item.track))
      .then((result) => {
        console.log("ARRAY OF PLAYLISTS:", result);
        return result;
      })
      .then((result) => setTracks(result))
      .then(() => setReady(true));
  }, [getPlaylist, id]);

  /* Handling dragging */
  const getDragAfterElement = (container, y) => {
    const draggableElements = [
      ...container.querySelectorAll(".track:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  };

  useEffect(() => {
    const containers = document.querySelectorAll(".container");
    containers.forEach((container) => {
      // console.log(container);
      container.addEventListener("dragover", (e) => {
        // console.log(e);
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector(".dragging");
        if (afterElement == null) {
          container.appendChild(draggable);
        } else {
          container.insertBefore(draggable, afterElement);
        }
      });
    });
  });

  return ready ? (
    <div>
      <h1>{title}</h1>
      <p>{displayName}</p>
      <button onClick={deletePlaylist}>Delete playlist</button>
      <div className="container">
        {tracks.map((track, index) => (
          <Track track={track} key={index}></Track>
        ))}
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
