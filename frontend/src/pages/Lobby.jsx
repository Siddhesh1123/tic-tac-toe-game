import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LobbyPage = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    // Fetch all games from the backend
    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:5000/active"); // Adjust the URL if needed
        const data = await response.json();

        if (data.games) {
          setGames(data.games);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="container mx-auto p-6 bg-white">
      {/* Go back to home button */}
      <button
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded mb-6"
        onClick={() => (window.location.href = "/home")}
      >
        &#8592; Go Back to Home
      </button>

      {games.length === 0 ? (
        <p className="text-center text-lg text-gray-700">No games available</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game._id} className="my-4">
              {(game.status === "waiting" || game.status === "finished") && (
                <Link to={`/game-board/${game._id}`}>
                  <div className="bg-white shadow-md hover:shadow-xl p-6 rounded-lg flex justify-between items-center border border-gray-200 transition-all duration-300">
                    <div className="flex flex-col">
                      <h3 className="text-xl font-semibold text-blue-500">
                        {game.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Status: {game.status}
                      </p>
                    </div>
                    <div className="ml-4">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
                        Join Game
                      </button>
                    </div>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LobbyPage;
