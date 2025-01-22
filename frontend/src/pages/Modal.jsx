import React from "react";

const Modal = ({ isOpen, onClose, match }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-pink-600 mb-4">{match.name}</h2>
        <div className="text-gray-700 mb-2">
          <strong className="text-pink-500">Opponent:</strong>{" "}
          {match.opponent.name}
        </div>
        <div className="text-gray-700 mb-4">
          <strong className="text-pink-500">Result:</strong> {match.result}
        </div>
        <div className="text-gray-700 mb-4">
          <strong className="text-pink-500">Moves:</strong>
          <ul className="list-disc pl-5">
            {match.moves.map((move, moveIndex) => (
              <li key={moveIndex} className="text-sm text-gray-600">
                Player {move.playerName} moved to ({move.move.row},{" "}
                {move.move.column}) at{" "}
                <span className="font-medium">
                  {new Date(move.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-gray-700 mb-4">
          <strong className="text-pink-500">Final Board:</strong>
          <div className="grid mt-2">
            {match.finalBoard.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-row justify-center mb-2">
                {row.map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    className={`w-16 h-16 flex items-center justify-center border-2 border-gray-300 rounded-lg transition duration-200 ease-in-out ${
                      cell === "X"
                        ? "bg-blue-500 text-white"
                        : cell === "O"
                        ? "bg-pink-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <button
          className="mt-4 bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-700 transition duration-300"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
