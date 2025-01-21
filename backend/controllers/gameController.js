import Game from "../models/Game.js";
import mongoose from "mongoose";

// Constants for game status
const GAME_STATUS = {
  WAITING: "waiting",
  ONGOING: "ongoing",
  FINISHED: "finished",
};

// Utility function to initialize the board
const initializeBoard = () => [
  ["-", "-", "-"],
  ["-", "-", "-"],
  ["-", "-", "-"],
];

// Validate move input
const validateMoveInput = (gameId, row, column) => {
  if (!gameId || row === undefined || column === undefined) {
    throw new Error("Missing required parameters: gameId, row, and column are required");
  }
  if (!Number.isInteger(row) || !Number.isInteger(column) || row < 0 || row > 2 || column < 0 || column > 2) {
    throw new Error("Invalid move: row and column must be integers between 0 and 2");
  }
  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    throw new Error("Invalid game ID format");
  }
};

// Check for a winner
const checkWinner = (board) => {
  for (let i = 0; i < 3; i++) {
    if (board[i][0] !== "-" && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return true;
    if (board[0][i] !== "-" && board[0][i] === board[1][i] && board[1][i] === board[2][i]) return true;
  }
  if (board[0][0] !== "-" && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return true;
  if (board[0][2] !== "-" && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return true;
  return false;
};

// Check if the board is full
const isBoardFull = (board) => board.every((row) => row.every((cell) => cell !== "-"));

// Start a new game
const startGame = async (req, res) => {
  try {
    const player1Id = req.user.userId;
    const { name } = req.body; // Extract the game name from the request body

    console.log("Starting game with player1:", player1Id);

    // Ensure the game name is provided
    if (!name) {
      return res.status(400).json({
        message: "Game name is required",
      });
    }

    const newGame = new Game({
      name, // Save the game name from the request body
      player1: new mongoose.Types.ObjectId(player1Id),
      board: initializeBoard(),
      status: GAME_STATUS.WAITING,
      turn: new mongoose.Types.ObjectId(player1Id),
    });

    await newGame.save();
    console.log("New game created:", newGame);

    res.status(201).json({
      message: "Game started successfully",
      game: newGame,
    });
  } catch (error) {
    console.error("Error in startGame:", error);
    res.status(500).json({
      message: "Error starting game",
      error: error.message,
    });
  }
};

// Join an existing game
const joinGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const player2Id = req.user.userId;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (game.status !== GAME_STATUS.WAITING) {
      return res.status(400).json({ message: "Game is not available to join" });
    }

    game.player2 = new mongoose.Types.ObjectId(player2Id);
    game.status = GAME_STATUS.ONGOING;
    await game.save();

    res.status(200).json({
      message: "Successfully joined the game",
      game,
    });
  } catch (error) {
    console.error("Error in joinGame:", error);
    res.status(500).json({
      message: "Error joining game",
      error: error.message,
    });
  }
};

// Make a move
const makeMove = async (req, res) => {
  try {
    const { gameId, row, column } = req.body;
    validateMoveInput(gameId, row, column);

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (game.status !== GAME_STATUS.ONGOING) {
      return res.status(400).json({ message: "Game is not currently ongoing" });
    }

    const currentPlayerId = req.user.userId;
    if (game.turn.toString() !== currentPlayerId) {
      return res.status(403).json({ message: "It's not your turn" });
    }

    if (game.board[row][column] !== "-") {
      return res.status(400).json({ message: "Cell is already occupied" });
    }

    // Assign the move to the correct player
    game.board[row][column] = game.player1.toString() === currentPlayerId ? "X" : "O";

    // Save the move to the history
    game.moveHistory.push({
      playerId: currentPlayerId,
      move: { row, column },
    });

    // Check if there's a winner or the board is full
    if (checkWinner(game.board)) {
      game.status = GAME_STATUS.FINISHED;
      game.winner = new mongoose.Types.ObjectId(currentPlayerId); // Ensure it's an ObjectId
    } else if (isBoardFull(game.board)) {
      game.status = GAME_STATUS.FINISHED;
      game.winner = null; // Draw
    } else {
      // Switch turn to the next player
      game.turn = game.player1.toString() === currentPlayerId ? game.player2 : game.player1;
    }

    // Save the game object
    await game.save();

    res.status(200).json({
      message: "Move made successfully",
      game,
    });
  } catch (error) {
    console.error("Error in makeMove:", error);
    res.status(500).json({
      message: "Error making move",
      error: error.message,
    });
  }
};

// Get game state
const getGameState = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findById(gameId)
      .populate("player1 player2 winner")
      .select("player1 player2 status winner moveHistory board createdAt name");
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const gameResult = game.status === GAME_STATUS.FINISHED 
      ? game.winner ? `${game.winner._id} wins` : "It's a draw" 
      : "Game is ongoing";

    res.status(200).json({
      game: {
        ...game.toObject(),
        result: gameResult,
      },
    });
  } catch (error) {
    console.error("Error in getGameState:", error);
    res.status(500).json({
      message: "Error retrieving game state",
      error: error.message,
    });
  }
};

// Get match history
const getMatchHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const games = await Game.find({
      $or: [{ player1: userId }, { player2: userId }],
      status: GAME_STATUS.FINISHED,
    })
      .populate("player1 player2 winner") // populate the winner object here
      .select("player1 player2 status winner moveHistory board createdAt name");

    const matchHistory = games.map((game) => {
      const opponent = game.player1._id.toString() === userId ? game.player2 : game.player1;

      const gameResult = game.status === GAME_STATUS.FINISHED
        ? game.winner
          ? `${game.winner._id}  wins` // Assuming winner has a `name` field
          : "It's a draw"
        : "Game is ongoing";

      return {
        gameId: game._id,
        name: game.name,
        opponent: {
          id: opponent._id,
          name: opponent.name,
        },
        result: gameResult,
        moves: game.moveHistory,
        finalBoard: game.board,
        playedAt: game.createdAt,
      };
    });

    res.status(200).json({
      matchHistory: matchHistory,
    });
  } catch (error) {
    console.error("Error in getMatchHistory:", error);
    res.status(500).json({
      message: "Error retrieving match history",
      error: error.message,
    });
  }
};

// Fetch all games and remove the finished ones from the list
const fetchAllGames = async (req, res) => {
  try {
    console.log("Fetching all games...");
    const games = await Game.find();
    console.log("Games fetched:", games);

    res.status(200).json({
      games: games,
    });
  } catch (error) {
    console.error("Error in fetchAllGames:", error);
    res.status(500).json({
      message: "Error fetching all games",
      error: error.message,
    });
  }
};






export {
  startGame,
  joinGame,
  makeMove,
  getGameState,
  getMatchHistory,
  fetchAllGames
};
