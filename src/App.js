import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // Create access token
  const CLIENT_ID = "4e395fc704b74c3dafb22621444b1e64";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      console.log("test");

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

  const login = () => {
    window.open(
      `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`,
      "_blank"
    );
  };

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sortify</h1>
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
    </div>
  );
}

export default App;
