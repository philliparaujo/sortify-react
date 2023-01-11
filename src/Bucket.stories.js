import React from "react";
import { Bucket } from "./Bucket";
import "./index.css";
import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const fakeInitialTrackIdsPromise = (trackIds) => {
  return Promise.resolve(trackIds);
};

const fakeTrack = ({ id }) => (
  <div className="track" style={{ height: 35 }}>
    {id}
  </div>
);

export default {
  title: "Bucket",
  component: Bucket,
  args: {
    initialTrackIdsPromise: null,
    handleSizeUpdate: () => {},
    Track: fakeTrack,
  },
};

const Template = (args) => (
  <DndProvider backend={HTML5Backend}>
    <Bucket {...args} />
  </DndProvider>
);

export const empty = Template.bind({});
empty.args = {
  initialTrackIdsPromise: fakeInitialTrackIdsPromise([]),
};

export const oneSong = Template.bind({});
oneSong.args = {
  initialTrackIdsPromise: fakeInitialTrackIdsPromise(["AAAA"]),
};

export const multipleSongs = Template.bind({});
multipleSongs.args = {
  initialTrackIdsPromise: fakeInitialTrackIdsPromise([
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
  ]),
};
