import React, { useState, useEffect } from "react";
import { useApi } from "./spotify.js";

// props = {playlist: ...,
//          getPlaylist: ...}
export function PlaylistPage(props) {
  const [tracks, setTracks] = useState();
  const [ready, setReady] = useState();

  const id = props.playlist.id;
  // const url = props.playlist.external_urls.spotify;
  // const image = props.playlist.images;
  const title = props.playlist.name;
  const userId = props.playlist.owner.id;
  const displayName = props.playlist.owner.display_name;
  // const numTracks = props.playlist.tracks.total;

  const getPlaylist = props.getPlaylist;

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
      <h2>{displayName}</h2>
      <div>
        {tracks.map((track) => (
          <p>{track}</p>
        ))}
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
