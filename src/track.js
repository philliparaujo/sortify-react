import React, { useEffect, useState } from "react";
import "./App.css";

export function Track(props) {
  const [buttonText, setButtonText] = useState("Play");
  const [playing, setPlaying] = useState(false);

  const divRef = React.useRef();
  const imgRef = React.useRef();
  const audioRef = React.useRef();
  const playRef = React.useRef();

  const id = props.track.id;
  const image = props.track.album.images[0];
  const name = props.track.name;
  const previewUrl = props.track.preview_url;
  // const artists = props.track.artists;
  // const durationMs = props.track.duration_ms;
  // const explicit = props.track.explicit;

  let imageUrl;
  if (image) {
    imageUrl = image.url;
  } else {
    imageUrl = null;
  }

  /* Colors tracks, sets up play button and audio on load */
  useEffect(() => {
    const getAverageRGB = (img) => {
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
      const RGB = getAverageRGB(img.target);
      divRef.current.style.backgroundColor = `rgb(${RGB.r},${RGB.g},${RGB.b})`;

      const relativeLuminance =
        0.2126 * RGB.r ** 2.2 + 0.7152 * RGB.g ** 2.2 + 0.0722 * RGB.b ** 2.2;

      divRef.current.children.namedItem("title").style.color = "white";
      if (relativeLuminance > 100000) {
        divRef.current.children.namedItem("title").style.color = "black";
      }
    };

    const img = imgRef.current;
    img.onload = (img) => {
      setTrackStyle(img);
    };

    const audio = audioRef.current;
    if (!audio.src) {
      playRef.current.disabled = true;
    }
    audio.addEventListener(
      "canplaythrough",
      () => {
        audio.playbackRate = 2;
      },
      false
    );

    pauseMe();
  }, [id]);

  /* Handles playing/pausing audio */

  const pauseMe = () => {
    audioRef.current.pause();
    setPlaying(undefined);
    setButtonText("Play");

    if (props.onPause) {
      props.onPause();
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

    if (props.onPlay) {
      props.onPlay(() => {
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

  return (
    <div
      id={id}
      ref={divRef}
      className="track"
      draggable="true"
      onDragStart={(e) => e.target.classList.add("dragging")}
      onDragEnd={(e) => e.target.classList.remove("dragging")}
    >
      <button ref={playRef} draggable="false" onClick={togglePlay}>
        {buttonText}
      </button>
      <audio
        ref={audioRef}
        src={previewUrl}
        type="audio/mp3"
        onEnded={pauseMe}
      ></audio>
      <img
        ref={imgRef}
        src={imageUrl}
        alt=""
        width="35"
        height="35"
        draggable="false"
      ></img>
      <p id="title" draggable="false">
        {name}
      </p>
    </div>
  );
}
