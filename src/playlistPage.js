import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert"; // confirmAlert JS
import "react-confirm-alert/src/react-confirm-alert.css"; // confirmAlert CSS

// props = {playlist: ...,
//          getPlaylist: (from api),
//          refreshPlaylists: (from api),
//          deselectPlaylist: (from setStates)}
export function PlaylistPage(props) {
  const [tracks, setTracks] = useState();
  const [ready, setReady] = useState();

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

  // Re-render on different playlist select
  useEffect(() => {
    setReady(false);

    getPlaylist(id)
      .then((result) => result.map((item) => item.track.name))
      .then((result) => setTracks(result))
      .then(() => setReady(true));
  }, [getPlaylist, id]);

  return ready ? (
    <div>
      <h1>{title}</h1>
      <p>{displayName}</p>
      <button onClick={deletePlaylist}>Delete playlist</button>
      <div>
        {tracks.map((track, index) => (
          <p key={index}>{track}</p>
        ))}
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
