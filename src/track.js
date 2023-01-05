import React, { useEffect } from "react";
import "./App.css";

export function Track(props) {
  const divRef = React.useRef();
  const imgRef = React.useRef();
  const audioRef = React.useRef();
  const playRef = React.useRef();

  const id = props.track.id;
  const image = props.track.album.images[0];
  const name = props.track.name;
  // const artists = props.track.artists;
  // const durationMs = props.track.duration_ms;
  // const explicit = props.track.explicit;
  const previewUrl = props.track.preview_url;

  let imageUrl;
  if (image) {
    imageUrl = image.url;
  } else {
    imageUrl = null;
  }

  var playing = React.useRef(undefined);
  if (playing.current === undefined) {
    playing.current = false;
  }

  /* Colors track on load */
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
      playRef.current.value = "BEGONE";
    }
    audio.addEventListener(
      "canplaythrough",
      () => {
        audio.playbackRate = 1.75;

        playRef.current.addEventListener("click", togglePlay);
      },
      false
    );
  }, [id]);

  const togglePlay = () => {
    if (!playing.current) {
      audioRef.current.play();
      playing.current = true;
    } else {
      audioRef.current.pause();
      playing.current = false;
    }
  };

  return (
    <div
      ref={divRef}
      className="track"
      draggable="true"
      onDragStart={(e) => e.target.classList.add("dragging")}
      onDragEnd={(e) => e.target.classList.remove("dragging")}
    >
      <button ref={playRef} draggable="false">
        Play
      </button>
      <audio ref={audioRef} src={previewUrl} type="audio/mp3"></audio>
      <img
        ref={imgRef}
        src={imageUrl}
        alt=""
        width="35"
        height="35"
        draggable="false"
        // hidden
      ></img>
      <p id="title" draggable="false">
        {name}
      </p>
    </div>
  );
}
