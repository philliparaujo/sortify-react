import React, { useEffect, useState } from "react";
import { Track as TrackComponent } from "./track";
import { useDrop } from "react-dnd";

export function Bucket({
  id,
  playlistId,
  getPlaylistTrackIds,
  onPlay,
  onPause,
  getTrackById,
  handleTracksUpdate,
  Track = TrackComponent,
}) {
  const [trackIds, setTrackIds] = useState([]);
  const [ready, setReady] = useState(true);

  /* on load, fetch trackIds */
  useEffect(() => {
    const fetch = () => {
      if (!playlistId) {
        clearInterval(retryFetch);
        return;
      }

      getPlaylistTrackIds(playlistId)
        .then((result) => {
          setTrackIds(result);
          return result;
        })
        .then((result) => {
          clearInterval(retryFetch);
          return result;
        })
        .then(() => {
          setReady(true);
        })
        .catch((error) => console.log("ERRORRRRR"));
    };

    // first fetch attempt
    fetch();

    // if error on fetch (too many API calls), retry until successful
    var retryFetch = setInterval(() => {
      console.log("RETRYING");
      fetch();
    }, 1000);

    // on component unmount
    return () => {
      clearInterval(retryFetch);
    };
  }, [getPlaylistTrackIds, playlistId]);

  // on track id update, update tracks
  useEffect(() => {
    handleTracksUpdate(id, trackIds);
    if (playlistId) {
      getPlaylistTrackIds(playlistId).then((result) => {
        console.log(trackIds, result);
        console.log(trackIds.every((value, index) => value === result[index]));
      });
    }
  }, [trackIds, handleTracksUpdate, id, getPlaylistTrackIds, playlistId]);

  /* Dragging functionality */
  const addTrackToBucket = (trackId) => {
    console.log(trackIds);
    setTrackIds((oldTrackIds) => [...oldTrackIds, trackId]);
  };

  const handleRemove = (trackId) => {
    setTrackIds((oldTrackIds) => {
      return oldTrackIds.filter((oldId) => oldId !== trackId);
    });
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "track",
    drop: (item) => {
      // HACK: setTimeout ensures track add happens after remove
      //       necessary for drag into same bucket
      setTimeout(() => {
        addTrackToBucket(item.id);
      }, 1);
      return;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return ready ? (
    <div
      ref={drop}
      id={id}
      className="bucket"
      style={{ backgroundColor: isOver ? "red" : "black" }}
    >
      {trackIds.map((trackId) => (
        <Track
          key={trackId}
          id={trackId}
          getTrackById={getTrackById}
          onPlay={onPlay}
          onPause={onPause}
          handleRemove={handleRemove}
        />
      ))}
      {trackIds.length === 0 ? <div>Please drop here</div> : null}
    </div>
  ) : (
    <div>Loading...</div>
  );
}
