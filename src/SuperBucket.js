import React from "react";
import { Bucket } from "./Bucket";

import { Box } from "@mui/material";

export function SuperBucket({
  bucketIds,
  handlePlay,
  handlePause,
  getTrackById,
  getPlaylistTrackIds,
  handleTracksUpdate,
}) {
  return (
    <Box className="superBucket">
      {bucketIds.map((id, index) => {
        if (id && String(id).localeCompare("#") === 0) {
          return null;
        }

        return (
          <Bucket
            key={index}
            id={index}
            playlistId={bucketIds[index]}
            getPlaylistTrackIds={getPlaylistTrackIds}
            onPlay={(pauseMe) => handlePlay(pauseMe)}
            onPause={handlePause}
            getTrackById={getTrackById}
            handleTracksUpdate={handleTracksUpdate}
          />
        );
      })}
    </Box>
  );
}
