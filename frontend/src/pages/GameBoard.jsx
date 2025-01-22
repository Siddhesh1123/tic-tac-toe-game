import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function GameBoard() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playerTurn, setPlayerTurn] = useState("");

  useEffect(() => {
    const fetchGameData = async () => {
      if (localStorage.getItem("token") === null) {
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/v1/games/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch game data");
        }

        const data = await response.json();
        setGame(data.game);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
    if (game) {
      setPlayerTurn(game.turn);
    }
  }, [id, game]);

  const handleJoinGame = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/v1/games/join/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join game");
      }

      const data = await response.json();
      toast.success("Game joined successfully!");
      window.location.reload();
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleCellClick = async (rowIndex, cellIndex) => {
    if (game.status !== "ongoing") {
      toast.error("Game is not ongoing");
      return;
    }

    if (game.turn !== playerTurn) {
      toast.error("It's not your turn");
      return;
    }

    if (game.board[rowIndex][cellIndex] !== "") {
      toast.error("Cell is already occupied!");
      return;
    }

    const symbol = playerTurn === game.player1._id ? "X" : "O";
    const newBoard = [...game.board];
    newBoard[rowIndex][cellIndex] = symbol;
    setGame({ ...game, board: newBoard });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/v1/games/move/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId: id, row: rowIndex, column: cellIndex }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to make a move");
      }

      const data = await response.json();
      setGame(data.game);
      setPlayerTurn(!playerTurn);
      toast.success("Move made successfully!");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center pt-10 bg-white">
      {loading && <div className="text-xl">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {game && (
        <>
          <h2 className="text-2xl font-bold mb-4">{game.name}</h2>

          <h2
            className={`text-xl mb-2 ${
              game.turn === game.player1._id ? "text-green-500" : ""
            }`}
          >
            Player 1: {game.player1.username}
          </h2>

          <div className="grid grid-cols-3 gap-2 w-64 h-64">
            {game.board.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <div
                  key={`${rowIndex}-${cellIndex}`}
                  className={`w-full h-full flex items-center justify-center border-2 border-gray-400 rounded-lg cursor-pointer transition duration-200 ease-in-out ${
                    cell === "X"
                      ? "bg-blue-500 text-white"
                      : cell === "O"
                      ? "bg-pink-500 text-white"
                      : "bg-white"
                  } hover:shadow-lg`}
                  onClick={() => handleCellClick(rowIndex, cellIndex)}
                >
                  {cell}
                </div>
              ))
            )}
          </div>

          {game.status === "waiting" && (
            <>
              <div className="text-xl">Waiting for players...</div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={handleJoinGame}
              >
                Join Game
              </button>
            </>
          )}

          {game.status === "ongoing" && (
            <>
              <h2
                className={`text-xl mb-2 ${
                  game.turn === game.player2._id ? "text-green-500" : ""
                }`}
              >
                Player 2: {game.player2.username}
              </h2>
            </>
          )}

          {game.status === "finished" && (
            <>
              <h2 className="text-xl">Game Over</h2>
              <h2 className="text-xl">Winner: {game.winner.username}</h2>
            </>
          )}

          <h2 className="text-xl">Status: {game.status}</h2>
        </>
      )}
    </div>
  );
}

export default GameBoard;
