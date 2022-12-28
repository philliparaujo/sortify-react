import React, { useEffect, useState } from "react";
import "./App.css";
import { playlists, whoami } from "./spotify";

function App() {
  const [myName, setMyName] = useState("????");
  const [myEmail, setMyEmail] = useState("????");
  const [allPlaylists, setAllPlaylists] = useState([
    { name: "a", id: "b", description: "c" },
    { name: "X", id: "Y", description: "Z" },
  ]);

  // Create access token
  const auth_info = {
    CLIENT_ID: "4e395fc704b74c3dafb22621444b1e64",
    REDIRECT_URI: "http://localhost:3000",
    AUTH_ENDPOINT: "https://accounts.spotify.com/authorize",
    RESPONSE_TYPE: "token",
  };

  const GetToken = () => {
    const [token, setToken] = useState("");

    useEffect(() => {
      const hash = window.location.hash;
      let token = window.localStorage.getItem("token");

      if (!token && hash) {
        token = hash
          .substring(1)
          .split("&")
          .find((elem) => elem.startsWith("access_token"))
          .split("=")[1];

        window.location.hash = "";
        window.localStorage.setItem("token", token);
      }
      setToken(token);
    }, []);

    return [token, setToken];
  };

  const [token, setToken] = GetToken();

  // const login = () => {
  //   // close previous logged-out page
  //   window.close();

  //   // open new logged-in page
  //   window.open(
  //     `${auth_info.AUTH_ENDPOINT}` +
  //       `?client_id=${auth_info.CLIENT_ID}` +
  //       `&redirect_uri=${auth_info.REDIRECT_URI}` +
  //       `&response_type=${auth_info.RESPONSE_TYPE}` +
  //       `&scope=playlist-read-private user-read-email`,
  //     "_blank"
  //   );
  // };

  const login = () => {
    // open new logged-in page
    document.location =
      `${auth_info.AUTH_ENDPOINT}` +
      `?client_id=${auth_info.CLIENT_ID}` +
      `&redirect_uri=${auth_info.REDIRECT_URI}` +
      `&response_type=${auth_info.RESPONSE_TYPE}` +
      `&scope=playlist-read-private user-read-email`;
  };

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  React.useEffect(() => {
    if (token) {
      whoami()
        .then((result) => {
          setMyName(result.name);
          setMyEmail(result.email);
        })
        .catch((error) => {
          if (error.needLogin) {
            logout();
            login();
          }
        });
      playlists()
        .then((p) => setAllPlaylists(p))
        .catch((error) => console.log("playlists failed", error));
    }
  }, [token]);

  return (
    <div className="App">
      <header className="App-header">
        Hi, {myName} ({myEmail})<h1>Sortify</h1>
        {!token ? (
          <div>
            <button onClick={login}>Login</button>
            <button disabled>Logout</button>
          </div>
        ) : (
          <div>
            <button disabled>Login</button>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </header>
      {allPlaylists.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}

export default App;
