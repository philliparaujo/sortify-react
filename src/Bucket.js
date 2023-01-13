import React, { useEffect, useState } from "react";
import { Track as TrackComponent } from "./track";
import { useDrop } from "react-dnd";
import { Box } from "@mui/material";

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
      console.log("RETRYING playlist fetch");
      fetch();
    }, 1000);

    // on component unmount
    return () => {
      clearInterval(retryFetch);
    };
  }, [getPlaylistTrackIds, playlistId]);

  /* on track id update, update tracks for playlistPage */
  useEffect(() => {
    handleTracksUpdate(id, trackIds);
  }, [trackIds, id, handleTracksUpdate]);

  /* Dragging functionality */
  const addTrackToBucket = (trackId) => {
    setTrackIds((oldTrackIds) => [...oldTrackIds, trackId]);
  };

  const handleRemove = (currentId) => {
    setTrackIds((oldTrackIds) => {
      return oldTrackIds.filter((oldId) => oldId !== currentId);
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

  const onMoveUp = (trackId) => {
    const index = trackIds.indexOf(trackId);
    if (index > 0) {
      moveTrackLocal(index, index - 1);
    }
  };

  const onMoveDown = (trackId) => {
    const index = trackIds.indexOf(trackId);
    if (index < trackIds.length - 1) {
      moveTrackLocal(index, index + 1);
    }
  };

  const moveTrackLocal = (prevIndex, newIndex) => {
    setTrackIds((oldTrackIds) => {
      const trackIdsCopy = [...oldTrackIds];
      const currentTrack = trackIdsCopy[prevIndex];
      trackIdsCopy.splice(prevIndex, 1);
      trackIdsCopy.splice(newIndex, 0, currentTrack);
      return trackIdsCopy;
    });
  };

  return ready ? (
    <Box
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
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      ))}
      {trackIds.length === 0 ? <div>Please drop here</div> : null}
    </Box>
  ) : (
    <Box>Loading...</Box>
  );
}
