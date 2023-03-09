import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { Track as TrackComponent } from "./track";

export function Bucket({
  id,
  playlistId,
  getPlaylistTrackIds,
  onPlay,
  onPause,
  getTrackById,
  handleTracksUpdate,
  speed,
  volume,
  Track = TrackComponent,
}) {
  const [trackIds, setTrackIds] = useState([]);
  const [idsFetched, setIdsFetched] = useState(false);

  /* on load, fetch trackIds */
  useEffect(() => {
    const fetch = () => {
      if (!playlistId) {
        return;
      }

      getPlaylistTrackIds(playlistId)
        .then((result) => {
          setTrackIds(result);
          setIdsFetched(true);
          return result;
        })
        .then((result) => {
          return result;
        })
        .catch((error) => {
          console.log("ERRORRRRR");
          fetch();
        });
    };

    fetch();
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
    const index = trackIds.indexOf(currentId);
    if (index < trackIds.length - 1) {
      moveTrackLocal(index, trackIds.length - 1);
    }
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

  return (
    <div
      ref={drop}
      id={id}
      className="bucket"
      style={{ backgroundColor: isOver ? "red" : "#333" }}
    >
      {trackIds.map((trackId) => (
        <Track
          key={trackId}
          id={trackId}
          getTrackById={getTrackById}
          onPlay={onPlay}
          onPause={onPause}
          speed={speed}
          volume={volume}
          handleRemove={handleRemove}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      ))}

      {playlistId && !idsFetched ? <Box>Loading...</Box> : null}
      {playlistId && idsFetched && trackIds.length === 0 ? (
        <Box>Please drop here</Box>
      ) : null}
      {!playlistId && trackIds.length === 0 ? (
        <Box>Please drop here</Box>
      ) : null}
    </div>
  );
}
