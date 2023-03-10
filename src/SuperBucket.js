import { Box } from "@mui/material";
import React from "react";
import { Bucket } from "./Bucket";

export function SuperBucket({
  handlePlay,
  handlePause,
  getTrackById,
  getPlaylistTrackIds,
  onTracksUpdate,
  bucketIds,
  bucketIdWithPlaylistId,
  playlistId,
  subscribeVolume,
  unsubscribeVolume,
  getVolume,
  subscribeSpeed,
  unsubscribeSpeed,
  getSpeed,
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
            onTracksUpdate={onTracksUpdate}
            subscribeVolume={subscribeVolume}
            unsubscribeVolume={unsubscribeVolume}
            getVolume={getVolume}
            subscribeSpeed={subscribeSpeed}
            unsubscribeSpeed={unsubscribeSpeed}
            getSpeed={getSpeed}
          />
        );
      })}
    </Box>
  );
}
