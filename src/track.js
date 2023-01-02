import { useEffect } from "react";
import "./App.css";

export function Track(props) {
  const artists = props.track.artists;
  const duration_ms = props.track.duration_ms;
  const explicit = props.track.explicit;
  const id = props.track.id;
  const image = props.track.album.images[0];
  const name = props.track.name;
  const preview_url = props.track.preview_url;

  let imageUrl;
  if (image) {
    imageUrl = image.url;
  } else {
    imageUrl = null;
  }

  // console.log(image);

  function getAverageRGB(imgEl) {
    console.log(imgEl);
    imgEl.setAttribute("crossOrigin", "");

    var blockSize = 5, // only visit every 5 pixels
      defaultRGB = { r: 200, g: 0, b: 0 }, // for non-supporting envs
      canvas = document.createElement("canvas"),
      context = canvas.getContext && canvas.getContext("2d"),
      data,
      width,
      height,
      i = -4,
      length,
      rgb = { r: 200, g: 0, b: 0 },
      count = 0;
    if (!context) {
      return defaultRGB;
    }

    console.log(imgEl.naturalHeight, imgEl.offsetHeight, imgEl.height);

    height = canvas.height =
      imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width =
      imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);
    data = context.getImageData(0, 0, width, height);
    length = data.data.length;

    while ((i += blockSize * 4) < length) {
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i + 1];
      rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;
  }
  /* Set up draggable properties (for sorting)*/
  useEffect(() => {
    const currentTrack = document.querySelector(`#A${id}`);
    currentTrack.addEventListener("dragstart", () => {
      currentTrack.classList.add("dragging");
    });
    currentTrack.addEventListener("dragend", () => {
      currentTrack.classList.remove("dragging");
    });

    // console.log(currentTrack.querySelector("img"));
    // const img = currentTrack.querySelector("img");
    // const RGB = getAverageRGB(img);
    // console.log(img, RGB);
    // currentTrack.style.backgroundColor = `rgb(${RGB.r},${RGB.g},${RGB.b})`;
  }, [id]);

  return (
    <div id={`A${id}`} className="track" draggable>
      <button>play</button>
      <img src={imageUrl} alt="F" width="20" height="20"></img>
      {name}
    </div>
  );
}
