import { useContext } from "react";
import { PlaylistId } from "./App.js";

export function NavBar(props) {
  const [{ playlistId, setPlaylistId }] = useContext(PlaylistId);

  const isLoggedIn = props.isLoggedIn;
  const name = props.name;
  const playlists = props.playlists;
  const selectedPlaylist = props.selectedPlaylist;

  const deselectPlaylist = props.deselectPlaylist;
  let logout, login;
  if (isLoggedIn) {
    logout = props.logout;
  } else {
    login = props.login;
  }
  const refreshPlaylists = props.refreshPlaylists;
  const createPlaylist = props.createPlaylist;
  const addSongToPlaylist = () => {
    props.addSongToPlaylist(selectedPlaylist.id);
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
              <button onClick={createPlaylist}>Create Playlist</button>
              <input id="newPlaylistNameInput" type="text" size="20"></input>
            </div>
            <div>
              <button onClick={addSongToPlaylist}>Add Song</button>
              <input id="songSearchInput" type="text" size="20"></input>
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
