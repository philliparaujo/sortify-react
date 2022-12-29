import "./App.css";
import React from "react";
import { useApi } from "./spotify.js";

function App() {
  const api = useApi();

  return (
    <div className="App">
      <header className="App-header">
        {api.name ? <p>Hi, {api.name}</p> : <p></p>}
        <h1>Sortify</h1>
      </header>
      {!api.isLoggedIn ? (
        <button onClick={api.login}>Login</button>
      ) : (
        <button onClick={api.logout}>Logout</button>
      )}
    </div>
  );
}
export default App;
