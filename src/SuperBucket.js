import React, { useState } from "react";
import { Bucket } from "./Bucket";

export function SuperBucket({
  bucketIds,
  handlePlay,
  handlePause,
  getTrackById,
  getPlaylistTrackIds,
  handleSizeUpdate,
  handleTracksUpdate,
  triggerBucketPause,
}) {
  return (
    <div className="superBucket">
      {Object.keys(bucketIds).map((id) => {
        const playlistId = bucketIds[id];
        return (
          <Bucket
            key={id}
            id={id}
            initialTrackIdsPromise={getPlaylistTrackIds(playlistId)}
            onPlay={(pauseMe) => handlePlay(pauseMe)}
            onPause={handlePause}
            getTrackById={getTrackById}
            handleSizeUpdate={handleSizeUpdate}
            handleTracksUpdate={handleTracksUpdate}
            triggerBucketPause={triggerBucketPause}
          />
        );
      })}
    </div>
  );
}
