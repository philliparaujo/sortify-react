import React from "react";
import { Bucket } from "./Bucket";

export function SuperBucket({
  bucketIds,
  handlePlay,
  handlePause,
  getTrackById,
  getPlaylistTrackIds,
  handleTracksUpdate,
  // triggerBucketPause,
}) {
  return (
    <div className="superBucket">
      {Object.keys(bucketIds).map((id) => {
        return (
          <Bucket
            key={id}
            id={id}
            playlistId={bucketIds[id]}
            getPlaylistTrackIds={getPlaylistTrackIds}
            onPlay={(pauseMe) => handlePlay(pauseMe)}
            onPause={handlePause}
            getTrackById={getTrackById}
            handleTracksUpdate={handleTracksUpdate}
            // triggerBucketPause={triggerBucketPause}
          />
        );
      })}
    </div>
  );
}
