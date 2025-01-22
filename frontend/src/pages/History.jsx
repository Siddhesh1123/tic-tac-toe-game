import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Modal from "./Modal"; // Import the Modal component

const History = () => {
  const [matchHistory, setMatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null); // State for the selected match
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/v1/games/history",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch game history");
        }

        const data = await response.json();
        setMatchHistory(data.matchHistory); // Assuming the response contains a 'matchHistory' field
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameHistory();
  }, []);

  const openModal = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  if (loading) {
    return <div className="text-center text-blue-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg ">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Game History
      </h2>
      {matchHistory.length === 0 ? (
        <div className="text-center text-gray-500">
          No game history available.
        </div>
      ) : (
        <ul>
          {matchHistory.map((match, index) => (
            <li
              key={index}
              className="mb-6 p-5 border-2 border-blue-200 rounded-lg hover:shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => openModal(match)} // Open modal on click
            >
              <h3 className="text-xl font-semibold text-blue-600">
                {match.name}
              </h3>
              <div className="text-gray-700">
                <strong>Opponent:</strong> {match.opponent.name}
              </div>
              <div className="text-gray-700">
                <strong>Result:</strong> {match.result}
              </div>
            </li>
          ))}
        </ul>
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} match={selectedMatch} />
    </div>
  );
};

export default History;
