import React from "react";
import { Bucket } from "./Bucket";

import { Box } from "@mui/material";

export function SuperBucket({
  handlePlay,
  handlePause,
  getTrackById,
  getPlaylistTrackIds,
  handleTracksUpdate,
  bucketIds,
  bucketIdWithPlaylistId,
  playlistId,
  speed,
  volume,
}) {
  return (
    <Box className="superBucket">
      {bucketIds.map((id) => {
        return (
          <Bucket
            key={id}
            id={id}
            playlistId={id == bucketIdWithPlaylistId ? playlistId : undefined}
            getPlaylistTrackIds={getPlaylistTrackIds}
            onPlay={(pauseMe) => handlePlay(pauseMe)}
            onPause={handlePause}
            getTrackById={getTrackById}
            handleTracksUpdate={handleTracksUpdate}
            speed={speed}
            volume={volume}
          />
        );
      })}
    </Box>
  );
}
