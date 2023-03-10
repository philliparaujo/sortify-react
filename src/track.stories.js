import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import "./index.css";
import darkImage from "./testData/darkAlbumImage.png";
import previewSong from "./testData/defaultPreviewSong.mp3";
import lightImage from "./testData/lightAlbumImage.jpg";
import defaultImage from "./testData/spotifyLogo.png";
import { Track } from "./track";

const defaultTrackData = {
  name: "Default Song",
  album: {
    images: [
      {
        url: defaultImage,
      },
    ],
  },
  preview_url: previewSong,
};

const decorators = [
  (Story) => (
    <div
      style={{
        backgroundColor: "#333",
        width: 227,
        margin: 6,
        padding: 20,
      }}
    >
      <Story />
    </div>
  ),
];

const fakeGetId = (id) => {
  return Promise.resolve(defaultTrackData);
};

export default {
  title: "Track",
  component: Track,
  args: {
    id: "ABC123",
    getTrackById: fakeGetId,
  },
  // decorators: decorators,
};

const Template = (args) => (
  <DndProvider backend={HTML5Backend}>
    <Track {...args} />
  </DndProvider>
);

export const empty = Template.bind({});
empty.args = {
  getTrackById: (id) =>
    Promise.resolve({
      name: "",
      album: { images: [{}] },
    }),
};
empty.decorators = decorators;

export const noImage = Template.bind({});
noImage.args = {
  getTrackById: (id) =>
    Promise.resolve({
      ...defaultTrackData,
      name: "No Image",
      album: { images: [{}] },
    }),
};
noImage.decorators = decorators;

export const darkColor = Template.bind({});
darkColor.args = {
  getTrackById: (id) =>
    Promise.resolve({
      ...defaultTrackData,
      name: "Dark Song!",
      album: {
        images: [
          {
            url: darkImage,
          },
        ],
      },
    }),
};
darkColor.decorators = decorators;

export const lightColor = Template.bind({});
lightColor.args = {
  getTrackById: (id) =>
    Promise.resolve({
      ...defaultTrackData,
      name: "Light Song!",
      album: {
        images: [
          {
            url: lightImage,
          },
        ],
      },
    }),
};
lightColor.decorators = decorators;

export const noAudioPreview = Template.bind({});
noAudioPreview.args = {
  getTrackById: (id) =>
    Promise.resolve({
      ...defaultTrackData,
      name: "No Audio Preview",
      preview_url: undefined,
    }),
};
noAudioPreview.decorators = decorators;

export const noBucket = Template.bind({});

export const longBucket = Template.bind({});
longBucket.decorators = [
  (Story) => (
    <div
      style={{
        backgroundColor: "#333",
        width: 400,
        margin: 6,
        padding: 20,
      }}
    >
      <Story />
    </div>
  ),
];

export const shortBucket = Template.bind({});
shortBucket.decorators = [
  (Story) => (
    <div
      style={{
        backgroundColor: "#333",
        width: 150,
        margin: 6,
        padding: 20,
      }}
    >
      <Story />
    </div>
  ),
];
