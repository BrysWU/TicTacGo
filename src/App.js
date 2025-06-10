import React, { useState } from "react";
import Queue from "./Queue";
import Board from "./Board";

function App() {
  const [gameState, setGameState] = useState(null);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20, textAlign: "center" }}>
      <h1>Tic Tac Toe Live</h1>
      {!gameState ? (
        <Queue onGameStart={setGameState} />
      ) : (
        <Board gameState={gameState} setGameState={setGameState} />
      )}
    </div>
  );
}

export default App;