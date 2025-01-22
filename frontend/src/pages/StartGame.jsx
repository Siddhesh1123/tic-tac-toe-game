import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function StartGame() {
  const [gameName, setGameName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleStartGame = async () => {
    if (localStorage.getItem("token") === null) {
      setError("You must be logged in to start a game.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("token", token);
      const response = await fetch("http://localhost:5000/api/v1/games/start", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: gameName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to start game");
      }

      const data = await response.json();
      console.log("data game ", data.game);

      navigate(`/game-board/${data.game._id}`);
      setGameName("");
      setSuccess("Game started successfully!");
      setError(null);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setSuccess(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-black">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Welcome to the Game!
      </h1>
      <p className="mb-8 text-lg font-semibold">
        Please enter the game name to start playing.
      </p>

      <div className="w-full max-w-sm bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Enter Game Name"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          className="w-full mb-4 p-3 border-2 border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleStartGame}
          className="w-full py-3 bg-pink-500 text-white font-semibold rounded-md hover:bg-pink-600 focus:ring-2 focus:ring-pink-300"
        >
          Start Game
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}
        {success && <p className="mt-4 text-green-500">{success}</p>}
      </div>
    </div>
  );
}

export default StartGame;
