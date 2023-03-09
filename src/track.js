import {
  ArrowDownward,
  ArrowUpward,
  Pause,
  PlayArrow,
} from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import "./App.css";

var colorCache = {};
var songCache = {};

export function Track({
  id, // of the track
  getTrackById,
  onPlay, // callback for when user clicks the play button
  onPause, // callback for when user clicks the pause button
  handleRemove,
  onMoveUp,
  onMoveDown,
  speed,
  volume,
}) {
  const [darkBackground, setDarkBackground] = useState(true);

  const [playing, setPlaying] = useState(false);

  const divRef = React.useRef();
  const audioRef = React.useRef();

  const [name, setName] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [artists, setArtists] = useState("");
  // const [durationMs, setDurationMs] = useState();
  // const [explicit, setExplicit] = useState();

  /* on load, fetch track id info */
  useEffect(() => {
    const applyTrackInfo = (trackInfo) => {
      if (!trackInfo) {
        return;
      }

      setName(trackInfo.name);
      if (trackInfo.album.images && trackInfo.album.images.length > 0) {
        setImageUrl(trackInfo.album.images[0].url);
      }
      setPreviewUrl(trackInfo.preview_url);
      setArtists(trackInfo.artists.map((artist) => " " + artist.name));
    };

    const fetch = () => {
      var trackInfo = songCache[id];
      if (!trackInfo) {
        getTrackById(id)
          .then((result) => {
            console.log("fetching");
            songCache[id] = result;

            applyTrackInfo(result);
            return result;
          })
          .then(() => {})
          .catch((error) => {
            console.log("ERRRRRRORRRRRRR");
            fetch();
          });
      } else {
        applyTrackInfo(trackInfo);
      }
    };

    fetch();
  }, [id, getTrackById]);

  /* Handles playing/pausing audio */
  const pauseMe = () => {
    setPlaying(false);

    // correctly plays song if paused by onEnded
    if (onPause) {
      onPause();
    }
  };

  const playMe = () => {
    setPlaying(true);

    // pauses other track previews
    if (onPlay) {
      onPlay(() => {
        pauseMe();
      });
    }
  };

  const togglePlay = () => {
    if (!playing) {
      playMe();
    } else {
      pauseMe();
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.src = previewUrl;
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, previewUrl]);

  useEffect(() => {
    if (playing && audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [playing, volume]);

  useEffect(() => {
    if (playing && audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [playing, speed]);

  /* Colors tracks, sets up play button and audio on load */
  const getAverageRGB = (img) => {
    // HACK: Force same origin to allow fetching Spotify's image without
    //       violating cross-origin rules.
    img.setAttribute("crossOrigin", "");

    var blockSize = 5, // only visit every 5 pixels
      canvas = document.createElement("canvas"),
      context = canvas.getContext && canvas.getContext("2d"),
      data,
      width,
      height,
      i = -4,
      length,
      rgb = { r: 0, g: 0, b: 0 },
      count = 0;

    height = canvas.height =
      img.naturalHeight || img.offsetHeight || img.height;
    width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;

    context.drawImage(img, 0, 0);
    data = context.getImageData(0, 0, width, height);
    length = data.data.length;

    while ((i += 4 * blockSize) < length) {
      count++;
      rgb.r += data.data[i];
      rgb.g += data.data[i + 1];
      rgb.b += data.data[i + 2];
    }

    rgb.r /= count;
    rgb.g /= count;
    rgb.b /= count;

    return rgb;
  };

  const setTrackStyle = (img) => {
    var rgb = colorCache[img.src];
    if (rgb === undefined) {
      rgb = getAverageRGB(img);
      if (JSON.stringify(rgb) !== JSON.stringify({ r: 0, g: 0, b: 0 })) {
        colorCache[img.src] = rgb;
      }
    }

    divRef.current.style.backgroundColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;

    const relativeLuminance =
      0.2126 * rgb.r ** 2.2 + 0.7152 * rgb.g ** 2.2 + 0.0722 * rgb.b ** 2.2;

    if (relativeLuminance > 100000) {
      setDarkBackground(false);
    }
  };

  /* Dragging functionality */
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "track",
    item: { id: id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        handleRemove(item.id);
      }
    },
  }));

  return (
    <div ref={drag}>
      <Box
        id={id}
        ref={divRef}
        className="track"
        border={isDragging ? "5px solid red" : "0px"}
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <IconButton
          draggable={false}
          onClick={togglePlay}
          disabled={!previewUrl}
          style={{
            color:
              !previewUrl && divRef.current
                ? divRef.current.style.backgroundColor
                : darkBackground
                ? "white"
                : "black",
          }}
          size="small"
        >
          {playing ? <Pause /> : <PlayArrow />}
        </IconButton>
        <div
          draggable={false}
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <IconButton
            onClick={() => onMoveUp(id)}
            style={{ backgroundColor: "lightgreen", padding: 0 }}
            disabled={onMoveUp === undefined}
            size="small"
          >
            <ArrowUpward
              className="arrows"
              fontSize="small"
              style={{ color: "black" }}
            />
          </IconButton>
          <IconButton
            onClick={() => onMoveDown(id)}
            style={{ backgroundColor: "coral", padding: 0 }}
            disabled={onMoveUp === undefined}
            size="small"
          >
            <ArrowDownward
              className="arrows"
              fontSize="small"
              style={{ color: "black" }}
            />
          </IconButton>
        </div>
        <audio
          ref={audioRef}
          type="audio/mp3"
          onEnded={pauseMe}
          onCanPlay={(e) => {
            e.target.playbackRate = speed;
            e.target.volume = volume;
          }}
        />
        <img
          src={imageUrl}
          alt=""
          width="40"
          height="40"
          draggable="false"
          onLoad={(e) => setTrackStyle(e.target)}
        ></img>
        <Tooltip title={artists.toString()} placement="top" followCursor>
          <Typography
            id="title"
            draggable="false"
            sx={{ color: darkBackground ? "#FFFFFF" : "#000000" }}
          >
            {name}
          </Typography>
        </Tooltip>
      </Box>
    </div>
  );
}
