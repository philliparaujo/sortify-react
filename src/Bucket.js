import React, { useEffect, useState } from "react";
import { Track as TrackComponent } from "./track";
import { useDrop } from "react-dnd";

export function Bucket({
  id,
  initialTrackIdsPromise,
  onPlay,
  onPause,
  getTrackById,
  handleSizeUpdate,
  handleTracksUpdate,
  triggerBucketPause,
  Track = TrackComponent,
}) {
  const [ready, setReady] = useState(true);
  const [triggerPause, setTriggerPause] = useState(false);

  // on load, set current track ids to passed in track ids
  const [trackIds, setTrackIds] = useState([]);
  useEffect(() => {
    if (initialTrackIdsPromise) {
      setReady(false);
      initialTrackIdsPromise
        .then((result) => setTrackIds(result))
        .then(() => setReady(true));
    }
  }, []);

  // on track id update, update the size
  useEffect(() => {
    handleSizeUpdate(id, trackIds.length);
    handleTracksUpdate(id, trackIds);
    // console.log(trackIds);
  }, [trackIds]);

  // on add, add one more track id
  const addTrackToBucket = (trackId) => {
    // console.log("ADDING");
    setTrackIds((trackIds) => [...trackIds, trackId]);
  };

  /* Dragging functionality */
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "track",
    drop: (item) => addTrackToBucket(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleRemove = (trackId) => {
    const firstInstance = trackIds.findIndex((element) => element === trackId);

    var newArray = [...trackIds];
    newArray = [
      ...newArray.slice(0, firstInstance),
      ...newArray.slice(firstInstance + 1, newArray.length),
    ];

    setTrackIds(newArray);
  };

  /* Pausing all tracks */
  const pauseAllTracks = () => {
    setTriggerPause((triggerPause) => !triggerPause);
  };

  useEffect(() => {
    if (triggerBucketPause !== undefined) {
      pauseAllTracks();
    }
  }, [triggerBucketPause]);

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
          triggerPause={triggerPause}
        />
      ))}
      {trackIds.length === 0 ? <div>Please drop here</div> : null}
    </div>
  ) : (
    <div>Loading...</div>
  );
}
