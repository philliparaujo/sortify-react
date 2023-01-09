import { useContext, useState } from "react";
import { PlaylistId } from "./App.js";

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
  const { setPlaylistId } = useContext(PlaylistId);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newSongInput, setNewSongInput] = useState("");

  const addSongToPlaylistNew = (playlist_id, title) => {
    if (selectedPlaylist === null) {
      throw new Error("No playlist selected");
    }
    addSongToPlaylist(playlist_id, title);
  };

  const createPlaylistNew = (newPlaylistName) => {
    createPlaylist(newPlaylistName).then(refreshPlaylists());
  };

  return (
    <div>
      <div className="behind-nav-bar"></div>

      <div className="nav-bar">
        {isLoggedIn ? (
          <div className="nav-header">
            <button onClick={logout}> Logout </button>
            <p>Hi, {name} </p>
            <button onClick={refreshPlaylists}> Refresh playlists</button>
            {selectedPlaylist ? (
              <button onClick={deselectPlaylist}>Deselect playlist</button>
            ) : (
              <button disabled>Deselect playlist</button>
            )}
            <div>
              <button
                onClick={() => {
                  createPlaylistNew(newPlaylistName);
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
                      setPlaylistId(index);
                    }}
                  >
                    {playlist.name}
                  </button>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
