import React, { useEffect, useState } from "react";
import { Track as TrackComponent } from "./track";

export function Bucket({
  initialPlaylistId,
  onPlay,
  onPause,
  getTrackById,
  initialTrackIds,
  Track = TrackComponent,
}) {
  // track id's
  const [currentTrackIds, setTrackIds] = useState([]);

  // const handleTrackDrag = (e) => {
  //   if (!document.querySelector(".bucket.dragging")) {
  //     e.preventDefault();
  //     const afterElement = getDragAfterElement(bucket, e.clientY);
  //     const draggable = document.querySelector(".track.dragging");
  //     if (afterElement == null) {
  //       bucket.appendChild(draggable);
  //     } else {
  //       bucket.insertBefore(draggable, afterElement);
  //     }
  //   }
  // };

  useEffect(() => {
    if (initialPlaylistId) {
      setTrackIds(initialTrackIds);
    }
  }, [initialPlaylistId, initialTrackIds]);

  return (
    <div
      className="bucket"
      draggable={true}
      // onDrop={(e) => {
      //   const trackData = JSON.parse(e.dataTransfer.getData("text/plain"));
      //   setTrackIds((currentTracks) => [...currentTracks, trackData]);
      // }}
      // onDragEnter={(e) => console.log("drag enter")}
      // onDragStart={(e) => {
      //   console.log(e.target.getAttribute("id"));
      //   // Find which song is being dragged
      //   const trackAsString = JSON.stringify(initialTrackIds[0]);
      //   e.dataTransfer.effectAllowed = "move";
      //   e.dataTransfer.setData("text/plain", trackAsString);
      // }}
      // onDragEnd={(e) => {
      //   // Remove the song dragged
      //   console.log(e.dataTransfer.getData("text/plain"));
      // }}
      // onDragOver={(e) => {
      //   e.preventDefault();
      // }}

      // onDragStart={(e) => {
      //   e.dataTransfer.setData("Text", e.target.id);
      // }}
      onDragEnter={(e) => {}}
      onDragLeave={(e) => {}}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        const track = e.dataTransfer.getData("Text");
        console.log(track);
        e.target.appendChild(document.getElementById(track));
      }}
    >
      {currentTrackIds.map((trackId) => (
        <Track
          key={trackId}
          id={trackId}
          getTrackById={getTrackById}
          onPlay={onPlay}
          onPause={onPause}
        />
      ))}
      {currentTrackIds.length === 0 ? <div>Please drop here</div> : null}
    </div>
  );
}
