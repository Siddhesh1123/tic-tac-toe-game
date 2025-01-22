import React from "react";
import { Link } from "react-router-dom";

function Home() {
  // Check if cookie is set or not
  if (localStorage.getItem("token")) {
    console.log("cookie is set");
    console.log("Token is ", localStorage.getItem("token"));
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="flex flex-col w-1/5 h-screen bg-blue-100 text-gray-800  p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Tic Tac Toe</h1>
        <ul className="space-y-4">
          <li className="py-2 hover:bg-pink-400 rounded-md text-center hover:text-white">
            <Link to="/start-game" className="text-lg font-medium">
              Start Game
            </Link>
          </li>
          <li className="py-2 hover:bg-pink-400 rounded-md text-center hover:text-white">
            <Link to="/lobby" className="text-lg font-medium">
              Lobby
            </Link>
          </li>
          <li className="py-2 hover:bg-pink-400 rounded-md text-center hover:text-white">
            <Link to="/history" className="text-lg font-medium">
              Game History
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 p-8">
        <h2 className="text-4xl font-bold text-blue-600 text-center mb-6">
          Game Rules
        </h2>
        <div className="bg-white shadow-lg rounded-lg p-6 text-gray-700">
          <ul className="space-y-4 text-lg">
            <li>1. The game is played on a 3x3 grid.</li>
            <li>
              2. Players take turns placing their marks (X or O) on the grid.
            </li>
            <li>
              3. The first player to align three of their marks in a row,
              column, or diagonal wins.
            </li>
            <li>
              4. If all nine squares are filled and no player has three marks in
              a row, the game ends in a draw.
            </li>
            <li>
              5. Be strategic to block your opponent and create opportunities to
              win!
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
