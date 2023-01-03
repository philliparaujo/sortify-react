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
  const addContainer = () => {
    const container = document.createElement("div");
    container.setAttribute("class", "container");
    container.draggable = true;

    // setup new container on creation
    container.addEventListener("dragover", (e) => {
      handleTrackDrag(e, container);
    });

    container.ondragstart = (e) => e.target.classList.add("dragging");
    container.ondragend = (e) => e.target.classList.remove("dragging");

    const page = document.querySelector(".superContainer");
    page.appendChild(container);
  };
  const removeEmptyContainer = () => {
    const containers = document.querySelectorAll(".container");
    var removed = false;
    containers.forEach((container) => {
      if (!container.firstChild && !removed) {
        container.remove();
        removed = true;
      }
    });
  };

  /* Re-render on playlist select */
  useEffect(() => {
    setReady(false);

    getPlaylist(id)
      .then((result) => result.map((item) => item.track))
      .then((result) => setTracks(result))
      .then(() => setReady(true));
  }, [getPlaylist, id]);

  /* Handling track dragging */
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

  const handleTrackDrag = (e, container) => {
    if (!document.querySelector(".container.dragging")) {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable = document.querySelector(".track.dragging");
      if (afterElement == null) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
    }
  };

  // on render, setup all containers
  useEffect(() => {
    const containers = document.querySelectorAll(".container");
    containers.forEach((container) => {
      container.addEventListener("dragover", (e) => {
        handleTrackDrag(e, container);
      });
      container.ondragstart = (e) => e.target.classList.add("dragging");
      container.ondragend = (e) => e.target.classList.remove("dragging");
      container.draggable = true;
    });
  });

  /* Handling container dragging */
  const getContainerDragAfterElement = (superContainer, x) => {
    const draggableElements = [
      ...superContainer.querySelectorAll(".container:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  };

  const handleContainerDrag = (e, superContainer) => {
    if (!document.querySelector(".track.dragging")) {
      e.preventDefault();
      const afterElement = getContainerDragAfterElement(
        superContainer,
        e.clientX
      );
      const draggable = document.querySelector(".container.dragging");
      if (afterElement == null) {
        superContainer.appendChild(draggable);
      } else {
        superContainer.insertBefore(draggable, afterElement);
      }
    }
  };

  // on render, setup all superContainers (only one)
  useEffect(() => {
    const superContainers = document.querySelectorAll(".superContainer");
    superContainers.forEach((superContainer) => {
      superContainer.addEventListener("dragover", (e) => {
        handleContainerDrag(e, superContainer);
      });
    });
  });

  return ready ? (
    <div>
      <h1>{title}</h1>
      <p>{displayName}</p>
      <button onClick={deletePlaylist}>Delete playlist</button>
      <button onClick={addContainer}>Add bucket</button>
      <button onClick={removeEmptyContainer}>Remove empty bucket</button>
      <div className="superContainer">
        <div className="container">
          {tracks.map((track, index) => (
            <Track track={track} key={index}></Track>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
