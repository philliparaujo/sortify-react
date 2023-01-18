import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import "./App.css";

import {
  ArrowDownward,
  ArrowUpward,
  Pause,
  PlayArrow,
} from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";

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

  const [playState, setPlayState] = useState(<PlayArrow />);
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
    const fetch = () => {
      getTrackById(id)
        .then((result) => {
          setName(result.name);
          if (result.album.images && result.album.images.length > 0) {
            setImageUrl(result.album.images[0].url);
          }
          setPreviewUrl(result.preview_url);
          setArtists(result.artists.map((artist) => " " + artist.name));
          return result;
        })
        .then(() => {
          clearInterval(retryFetch);
        })
        .catch((error) => console.log("ERRRRRRORRRRRRR"));
    };

    // first fetch attempt
    fetch();

    // if error on fetch (too many API calls), retry until successful
    var retryFetch = setInterval(() => {
      console.log("OH NO");
      fetch();
    }, 1000);

    // on component unmount
    return () => {
      clearInterval(retryFetch);
    };
  }, [id, getTrackById, speed, volume]);

  useEffect(() => {
    audioRef.current.playbackRate = speed;
    audioRef.current.volume = volume;
  }, [speed, volume]);

  /* Handles playing/pausing audio */
  const pauseMe = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
    setPlaying(undefined);
    setPlayState(<PlayArrow />);
  };

  const playMe = () => {
    if (!audioRef.current) {
      return;
    }

    var playPromise = audioRef.current.play();
    playPromise
      .then(() => {
        setPlaying(id);
        setPlayState(<Pause />);
      })
      .catch((error) => console.log(error));

    // pauses other track previews
    if (onPlay) {
      onPlay(() => {
        pauseMe();
      });
    }
  };

  const togglePlay = () => {
    if (playing === undefined || audioRef.current.paused) {
      playMe();
    } else {
      pauseMe();

      // correctly plays song if paused by onEnded
      if (onPause) {
        onPause();
      }
    }
  };

  /* Colors tracks, sets up play button and audio on load */
  const getAverageRGB = (img) => {
    // HACK: Force same origin to allow fetching Spotify's image without
    //       violating cross-origin rules.
    img.setAttribute("crossOrigin", "");

    var blockSize = 5, // only visit every 5 pixels
      defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
      canvas = document.createElement("canvas"),
      context = canvas.getContext && canvas.getContext("2d"),
      data,
      width,
      height,
      i = -4,
      length,
      rgb = { r: 0, g: 0, b: 0 },
      count = 0;
    if (!context) {
      return defaultRGB;
    }

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
    const RGB = getAverageRGB(img);
    divRef.current.style.backgroundColor = `rgb(${RGB.r},${RGB.g},${RGB.b})`;

    const relativeLuminance =
      0.2126 * RGB.r ** 2.2 + 0.7152 * RGB.g ** 2.2 + 0.0722 * RGB.b ** 2.2;

    if (relativeLuminance > 100000) {
      setDarkBackground(false);
      setPlayState(<PlayArrow />);
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
          {playState}
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
          src={previewUrl}
          type="audio/mp3"
          onEnded={pauseMe}
          onCanPlay={(e) => {
            e.target.playbackRate = speed;
            e.target.volume = 0.05;
          }}
        ></audio>
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
