import Game from "../models/Game.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Start a new game
const startGame = async (req, res) => {
  try {
    const player1Id = req.user.userId; // Make sure we're using the string ID
    console.log("Starting game with player1:", player1Id);

    const newGame = new Game({
      player1: new mongoose.Types.ObjectId(player1Id),
      board: [
        ["-", "-", "-"],
        ["-", "-", "-"],
        ["-", "-", "-"],
      ],
      status: "waiting",
      turn: new mongoose.Types.ObjectId(player1Id), // Make sure turn is set to player1
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

    // Make sure game isn't full
    if (game.player2) {
      return res.status(400).json({ message: "Game is already full" });
    }

    // Make sure player isn't joining their own game
    if (game.player1.toString() === player2Id) {
      return res.status(400).json({ message: "Cannot join your own game" });
    }

    // Update game with player2
    game.player2 = new mongoose.Types.ObjectId(player2Id);
    game.status = "ongoing";
    // Don't change the turn here - it should stay with player1

    await game.save();
    console.log("Updated game after join:", game);

    res.status(200).json({
      message: "Game joined successfully",
      game: game
    });
  } catch (error) {
    console.error("Error in joinGame:", error);
    res.status(500).json({
      message: "Error joining game",
      error: error.message
    });
  }
};

// Make a move in the game
const makeMove = async (req, res) => {
  try {
    const { gameId, row, column } = req.body;

    // Validate input parameters
    if (!gameId || row === undefined || column === undefined) {
      return res.status(400).json({
        message:
          "Missing required parameters: gameId, row, and column are required",
      });
    }

    // Validate row and column are numbers and within bounds
    if (
      !Number.isInteger(row) ||
      !Number.isInteger(column) ||
      row < 0 ||
      row > 2 ||
      column < 0 ||
      column > 2
    ) {
      return res.status(400).json({
        message:
          "Invalid move: row and column must be integers between 0 and 2",
      });
    }

    // Ensure gameId is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: "Invalid game ID format" });
    }

    // Get current player's ID from the token
    const playerId = req.user.userId;

    // Find the game without population first
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Validate game state
    if (game.status !== "ongoing") {
      return res.status(400).json({
        message: `Game is not active. Current status: ${game.status}`,
      });
    }

    // Convert IDs to strings for comparison
    const currentPlayerId = playerId.toString();
    const player1Id = game.player1.toString();
    const player2Id = game.player2 ? game.player2.toString() : null;
    const turnId = game.turn.toString();

    // Inside makeMove function, add these console.logs:
    console.log({
      requestUserId: currentPlayerId,
      gamePlayer1: player1Id,
      gamePlayer2: player2Id,
      gameTurn: turnId,
      fullGame: game,
    });
    // Validate player belongs to the game
    if (currentPlayerId !== player1Id && currentPlayerId !== player2Id) {
      return res
        .status(403)
        .json({ message: "You are not a player in this game" });
    }

    // Validate turn
    if (currentPlayerId !== turnId) {
      return res.status(403).json({
        message: "It's not your turn",
      });
    }

    // Validate move position
    if (game.board[row][column] !== "-") {
      return res.status(400).json({
        message: "Invalid move: Position already taken",
        board: game.board,
      });
    }

    // Make the move
    const playerSymbol = currentPlayerId === player1Id ? "X" : "O";
    game.board[row][column] = playerSymbol;

    // Check for winner
    if (checkWinner(game.board)) {
      game.status = "finished";
      game.winner = new mongoose.Types.ObjectId(currentPlayerId);
      await game.save();

      return res.status(200).json({
        message: "Game Over! You won!",
        game: game,
      });
    }

    // Check for draw
    if (isBoardFull(game.board)) {
      game.status = "finished";
      game.winner = null;
      await game.save();

      return res.status(200).json({
        message: "Game Over! It's a draw!",
        game: game,
      });
    }

    // Switch turn
    game.turn =
      currentPlayerId === player1Id
        ? new mongoose.Types.ObjectId(player2Id)
        : new mongoose.Types.ObjectId(player1Id);

    await game.save();

    res.status(200).json({
      message: "Move made successfully",
      game: game,
    });
  } catch (error) {
    console.error("Error in makeMove:", error);
    res.status(500).json({
      message: "Error making move",
      error: error.message,
    });
  }
};

// Helper functions remain the same
const checkWinner = (board) => {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] !== "-" &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    )
      return true;
    if (
      board[0][i] !== "-" &&
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i]
    )
      return true;
  }
  if (
    board[0][0] !== "-" &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  )
    return true;
  if (
    board[0][2] !== "-" &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  )
    return true;
  return false;
};

const isBoardFull = (board) =>
  board.every((row) => row.every((cell) => cell !== "-"));

// Helper function to check if board is full (remains the same)

// Get game state
const getGameState = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId);

    if (!game) return res.status(404).json({ message: "Game not found" });

    res.status(200).json({ game });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching game state", error: error.message });
  }
};

// Match history
const getMatchHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Fetching history for user:", userId);  // Debug log

    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const games = await Game.find({
      $or: [
        { player1: userObjectId },
        { player2: userObjectId }
      ]
    })
    .populate('player1', 'username')
    .populate('player2', 'username')
    .sort({ updatedAt: -1 });

    console.log("Found games:", games.length);  // Debug log

    // Format the response
    const formattedGames = games.map(game => ({
      gameId: game._id,
      startDate: game.createdAt,
      status: game.status,
      opponent: game.player1._id.toString() === userId 
        ? game.player2?.username || 'Waiting for player' 
        : game.player1.username,
      result: game.status === 'finished' 
        ? game.winner 
          ? (game.winner.toString() === userId ? 'Won' : 'Lost')
          : 'Draw'
        : 'Ongoing',
      board: game.board
    }));

    res.status(200).json({ 
      message: "Match history retrieved successfully",
      games: formattedGames 
    });

  } catch (error) {
    console.error('Error in getMatchHistory:', error);  // Debug log
    res.status(500).json({ 
      message: "Error fetching match history", 
      error: error.message 
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.userId, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

export {
  startGame,
  joinGame,
  makeMove,
  getGameState,
  getMatchHistory,
  updateUserProfile,
};
