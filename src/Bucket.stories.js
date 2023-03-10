import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import { Bucket } from "./Bucket";
import "./index.css";

const fakeTrack = ({ id }) => (
  <div className="track" style={{ height: 35 }}>
    {id}
  </div>
);

export default {
  title: "Bucket",
  component: Bucket,
  args: {
    playlistId: "",
    getPlaylistTrackIds: (playlistId) => {
      return Promise.resolve([playlistId].flat());
    },
    handleTracksUpdate: () => {},
    Track: fakeTrack,
  },
};

const Template = (args) => (
  <DndProvider backend={HTML5Backend}>
    <Bucket {...args} />
  </DndProvider>
);

export const empty = Template.bind({});

export const oneSong = Template.bind({});
oneSong.args = {
  playlistId: "AAA",
};

export const multipleSongs = Template.bind({});
multipleSongs.args = {
  playlistId: [
    "AAAA",
    "BBBB",
    "CCCC",
    "DDDD",
    "EEEE",
    "FFFF",
    "GGGG",
    "HHHH",
    "IIII",
    "JJJJ",
    "KKKK",
    "LLLL",
    "MMMM",
    "NNNN",
    "OOOO",
    "PPPP",
  ],
};
