import React, { useEffect, useState } from "react";

const Board = ({ gameState, setGameState }) => {
  const { socket, symbol, board: initialBoard, turn, gameId } = gameState;
  const [board, setBoard] = useState(initialBoard);
  const [currentTurn, setTurn] = useState(turn);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.on("gameUpdate", ({ board, turn, winner }) => {
      setBoard([...board]);
      setTurn(turn);
      setWinner(winner);
    });

    socket.on("opponentLeft", () => {
      setWinner("Opponent left");
    });

    return () => {
      socket.off("gameUpdate");
      socket.off("opponentLeft");
    };
  }, [socket]);

  const handleClick = (idx) => {
    if (winner || board[idx] || currentTurn !== symbol) return;
    socket.emit("makeMove", { gameId, index: idx, symbol });
  };

  const renderCell = (idx) => (
    <td
      key={idx}
      style={{
        width: 60,
        height: 60,
        fontSize: 32,
        border: "1px solid #333",
        cursor: board[idx] || winner || currentTurn !== symbol ? "not-allowed" : "pointer",
        background: board[idx] ? "#fafafa" : "#fff"
      }}
      onClick={() => handleClick(idx)}
    >
      {board[idx] || ""}
    </td>
  );

  return (
    <div>
      <h2>
        You are <span style={{ color: symbol === "X" ? "#d33" : "#36c" }}>{symbol}</span>
      </h2>
      <h3>
        {winner
          ? winner === "draw"
            ? "It's a draw!"
            : winner === symbol
            ? "You win!"
            : winner === "Opponent left"
            ? "Opponent left the game."
            : "You lose."
          : currentTurn === symbol
          ? "Your turn"
          : "Opponent's turn"}
      </h3>
      <table style={{ margin: "20px auto", borderCollapse: "collapse" }}>
        <tbody>
          {[0, 1, 2].map(row =>
            <tr key={row}>
              {[0, 1, 2].map(col => renderCell(row * 3 + col))}
            </tr>
          )}
        </tbody>
      </table>
      {winner && (
        <button style={{ padding: 10, fontSize: 16 }} onClick={() => window.location.reload()}>
          Play Again
        </button>
      )}
    </div>
  );
};

export default Board;