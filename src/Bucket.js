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
  // triggerBucketPause,
  Track = TrackComponent,
}) {
  const [trackIds, setTrackIds] = useState([]);
  const [ready, setReady] = useState(true);
  // const [triggerPause, setTriggerPause] = useState(false);

  // on load, set current track ids to passed in track ids
  useEffect(() => {
    if (getPlaylistTrackIds && playlistId) {
      setReady(false);
      getPlaylistTrackIds(playlistId)
        .then((result) => setTrackIds(result))
        .then(() => setReady(true));
    }
  }, [getPlaylistTrackIds, playlistId]);

  // on track id update, update tracks
  useEffect(() => {
    handleTracksUpdate(id, trackIds);
  }, [trackIds, handleTracksUpdate, id]);

  /* Dragging functionality */
  const addTrackToBucket = (trackId) => {
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

  /* Pausing all tracks */
  // const pauseAllTracks = () => {
  //   setTriggerPause((triggerPause) => !triggerPause);
  // };

  // useEffect(() => {
  //   if (triggerBucketPause !== undefined) {
  //     pauseAllTracks();
  //   }
  // }, [triggerBucketPause]);

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
          // triggerPause={triggerPause}
        />
      ))}
      {trackIds.length === 0 ? <div>Please drop here</div> : null}
    </div>
  ) : (
    <div>Loading...</div>
  );
}
