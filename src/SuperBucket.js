import React from "react";
import { Bucket } from "./Bucket";

export function SuperBucket({
  bucketIds,
  trackIds,
  handlePlay,
  handlePause,
  getTrackById,
}) {
  return (
    <div className="superBucket">
      {bucketIds.map(({ id, playlistId }) => (
        <Bucket
          key={id}
          initialPlaylistId={playlistId}
          onPlay={(pauseMe) => handlePlay(pauseMe)}
          onPause={handlePause}
          // getPlaylistTrackIds={getPlaylistTrackIds}
          getTrackById={getTrackById}
          initialTrackIds={trackIds}
        />
      ))}
      {/* <Bucket></Bucket> */}
    </div>
  );
}
