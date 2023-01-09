import React from "react";
import { Bucket } from "./Bucket";
import "./index.css";
import "./App.css";

const fakeGetPlaylistTrackIds = (playlistId) => {
  return Promise.resolve(["AAA", "BBB", "CCC", "DDD"]);
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
    initialPlaylistId: "123",
    getPlaylistTrackIds: fakeGetPlaylistTrackIds,
    Track: fakeTrack,
  },
};

const Template = (args) => <Bucket {...args} />;

export const empty = Template.bind({});
empty.args = {
  getPlaylistTrackIds: (playlistId) => {
    return Promise.resolve([]);
  },
};

export const oneSong = Template.bind({});
oneSong.args = {
  getPlaylistTrackIds: (playlistId) => {
    return Promise.resolve(["AAA"]);
  },
};

export const multipleSongs = Template.bind({});
multipleSongs.args = {
  getPlaylistTrackIds: (playlistId) => {
    return Promise.resolve([
      "AAA",
      "BBB",
      "CCC",
      "DDD",
      "EEE",
      "FFF",
      "GGG",
      "HHH",
      "III",
      "JJJ",
      "KKK",
      "LLL",
      "MMM",
      "NNN",
    ]);
  },
};
