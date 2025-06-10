import React, { useState } from "react";
import { io } from "socket.io-client";

// Replace with your Render backend URL after deploying!
const SOCKET_URL = "https://your-render-backend-url.onrender.com";

let socket;

const Queue = ({ onGameStart }) => {
  const [nickname, setNickname] = useState("");
  const [waiting, setWaiting] = useState(false);

  const joinQueue = () => {
    socket = io(SOCKET_URL);
    socket.emit("joinQueue", nickname);

    setWaiting(true);

    socket.on("gameStart", (data) => {
      onGameStart({ ...data, socket });
    });

    socket.on("disconnect", () => {
      setWaiting(false);
    });
  };

  return (
    <div>
      <input
        placeholder="Enter nickname (optional)"
        value={nickname}
        onChange={e => setNickname(e.target.value)}
        disabled={waiting}
        style={{ padding: 8, fontSize: 16 }}
      />
      <button
        style={{ marginLeft: 10, padding: 8, fontSize: 16 }}
        onClick={joinQueue}
        disabled={waiting}
      >
        Play
      </button>
      {waiting && <p>Waiting for opponent...</p>}
    </div>
  );
};

export default Queue;