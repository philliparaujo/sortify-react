import "./wdyr";

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
  onTracksUpdate,
  subscribeVolume,
  unsubscribeVolume,
  getVolume,
  subscribeSpeed,
  unsubscribeSpeed,
  getSpeed,
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
        .catch((error) => {
          console.log("ERRORRRRR");
          setTimeout(() => fetch(), 1000);
        });
    };

    fetch();
  }, [getPlaylistTrackIds, playlistId]);

  /* on track id update, update tracks for playlistPage */
  useEffect(() => {
    onTracksUpdate(id, trackIds);
  }, [trackIds, id, onTracksUpdate]);

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
          handleRemove={handleRemove}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          subscribeVolume={subscribeVolume}
          unsubscribeVolume={unsubscribeVolume}
          getVolume={getVolume}
          subscribeSpeed={subscribeSpeed}
          unsubscribeSpeed={unsubscribeSpeed}
          getSpeed={getSpeed}
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

Bucket.whyDidYouRender = true;
