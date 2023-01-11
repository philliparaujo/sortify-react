import { useContext, useEffect, useState } from "react";
import { PlaylistIndex } from "./App.js";

export function NavBar({
  isLoggedIn,
  name,
  playlists,
  selectedPlaylist,
  deselectPlaylist,
  login,
  logout,
  refreshPlaylists,
  createPlaylist,
  addSongToPlaylist,
}) {
  const { setPlaylistIndex } = useContext(PlaylistIndex);
  const [playlistId, setPlaylistId] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newSongInput, setNewSongInput] = useState("");

  useEffect(() => {
    if (playlistId && selectedPlaylist) {
      setPlaylistIndex(getPlaylistIndex(playlistId));
    }
  }, [playlists]);

  const addSongToPlaylistNew = (playlistId, title) => {
    if (selectedPlaylist === null) {
      throw new Error("No playlist selected");
    }
    addSongToPlaylist(playlistId, title);
  };

  const getPlaylistIndex = (playlistId) => {
    for (let i = 0; i < playlists.length; i++) {
      if (playlists[i].id === playlistId) {
        return i;
      }
    }

    console.log(`Playlist index not found for ${playlistId}`);
    return 0;
  };

  return (
    <>
      <div className="behind-nav-bar"></div>

      <div className="nav-bar">
        {isLoggedIn ? (
          <div className="nav-header">
            <button onClick={logout}> Logout </button>
            <p>Hi, {name} </p>
            <button onClick={refreshPlaylists}> Refresh playlists</button>
            {playlistId ? (
              <button onClick={deselectPlaylist}>Deselect playlist</button>
            ) : (
              <button disabled>Deselect playlist</button>
            )}
            <div>
              <button
                onClick={() => {
                  createPlaylist(newPlaylistName);
                  setNewPlaylistName("");
                }}
              >
                Create Playlist
              </button>
              <input
                type="text"
                size="20"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
              />
            </div>
            <div>
              <button
                onClick={() => {
                  addSongToPlaylistNew(selectedPlaylist.id, newSongInput);
                  setNewSongInput("");
                }}
              >
                Add Song
              </button>
              <input
                type="text"
                size="20"
                value={newSongInput}
                onChange={(e) => setNewSongInput(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="nav-header">
            <button onClick={login}> Login </button>
          </div>
        )}

        <div className="allPlaylists">
          {isLoggedIn && playlists
            ? playlists.map((playlist, index) => (
                <div key={index}>
                  <button
                    className="playlistButtons"
                    key={index}
                    onClick={() => {
                      deselectPlaylist();
                      setPlaylistIndex(index);
                      setPlaylistId(playlist.id);
                    }}
                  >
                    {playlist.name}
                  </button>
                </div>
              ))
            : null}
        </div>
      </div>
    </>
  );
}
