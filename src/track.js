import React, { useEffect, useState } from "react";
import "./App.css";

export function Track({ id, getTrackById, onPlay, onPause }) {
  const [buttonText, setButtonText] = useState("Play");
  const [playing, setPlaying] = useState(false);

  const divRef = React.useRef();
  const audioRef = React.useRef();

  /* Get info from track id */
  const [name, setName] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  // const [artists, setArtists] = useState();
  // const [durationMs, setDurationMs] = useState();
  // const [explicit, setExplicit] = useState();

  useEffect(() => {
    getTrackById(id).then((result) => {
      setName(result.name);
      if (result.album.images && result.album.images.length > 0) {
        setImageUrl(result.album.images[0].url);
      }
      setPreviewUrl(result.preview_url);
      // setArtists(result.artists);
      // setdurationMs(result.duration_ms);
      // setExplicit(result.explicit);
    });
  }, [id]);

  /* Handles playing/pausing audio */
  const pauseMe = () => {
    audioRef.current.pause();
    setPlaying(undefined);
    setButtonText("Play");

    if (onPause) {
      onPause();
    }
  };

  const playMe = () => {
    var playPromise = audioRef.current.play();
    playPromise
      .then(() => {
        setPlaying(id);
        setButtonText("Pause");
      })
      .catch((error) => console.log(error));

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

    divRef.current.children.namedItem("title").style.color = "white";
    if (relativeLuminance > 100000) {
      divRef.current.children.namedItem("title").style.color = "black";
    }
  };

  return (
    <div
      id={id}
      ref={divRef}
      className="track"
      draggable="true"
      onDragStart={(e) => {
        e.dataTransfer.setData("Text", e.target.id);
        console.log("DRAG START", e.target.id);
      }}
    >
      <button draggable="false" onClick={togglePlay} disabled={!previewUrl}>
        {buttonText}
      </button>
      <audio
        ref={audioRef}
        src={previewUrl}
        type="audio/mp3"
        onEnded={pauseMe}
        playbackrate={2}
      ></audio>
      <img
        src={imageUrl}
        alt=""
        width="35"
        height="35"
        draggable="false"
        onLoad={(e) => setTrackStyle(e.target)}
      ></img>
      <p id="title" draggable="false">
        {name}
      </p>
    </div>
  );
}
