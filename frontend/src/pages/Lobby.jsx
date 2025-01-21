import React, { useState, useEffect } from 'react';

const LobbyPage = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    // Fetch all games from the backend
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/active'); // Adjust the URL if needed
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
    <div>
      <h1>Lobby</h1>
      {games.length === 0 ? (
        <p>No games available</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game._id}>
              Game Name: {game.name} 
              <br />
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LobbyPage;
