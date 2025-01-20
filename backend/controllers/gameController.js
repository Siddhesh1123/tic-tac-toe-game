import Game from '../models/Game.js';
import User from '../models/User.js';

// Start a new game
const startGame = async (req, res) => {
  try {
    const player1 = req.user.userId; // Assuming you're storing the user info in the token

    const game = new Game({
      player1,
      status: 'waiting',
    });

    await game.save();
    res.status(201).json({ message: 'Game started', gameId: game._id });
  } catch (error) {
    res.status(500).json({ message: 'Error starting game', error: error.message });
  }
};

// Join an existing game
const joinGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const player2 = req.user.userId;

    const game = await Game.findById(gameId);

    if (!game) return res.status(404).json({ message: 'Game not found' });
    if (game.status !== 'waiting') return res.status(400).json({ message: 'Game already started or finished' });

    game.player2 = player2;
    game.status = 'ongoing';
    await game.save();

    res.status(200).json({ message: 'Game joined successfully', game });
  } catch (error) {
    res.status(500).json({ message: 'Error joining game', error: error.message });
  }
};

// Make a move in the game
const makeMove = async (req, res) => {
  try {
    const { gameId, row, column } = req.body;
    const player = req.user.userId;

    const game = await Game.findById(gameId);

    if (!game) return res.status(404).json({ message: 'Game not found' });
    if (game.status !== 'ongoing') return res.status(400).json({ message: 'Game is not active' });

    const currentPlayer = game.turn === 'player1' ? game.player1 : game.player2;
    if (player.toString() !== currentPlayer.toString()) {
      return res.status(403).json({ message: "It's not your turn" });
    }

    if (game.board[row][column] !== '-') {
      return res.status(400).json({ message: 'Invalid move. Position already taken' });
    }

    game.board[row][column] = game.turn === 'player1' ? 'X' : 'O';

    if (checkWinner(game.board)) {
      game.status = 'finished';
      game.winner = game.turn;
    } else if (isBoardFull(game.board)) {
      game.status = 'finished';
      game.winner = 'draw';
    } else {
      game.turn = game.turn === 'player1' ? 'player2' : 'player1';
    }

    await game.save();
    res.status(200).json({ message: 'Move made successfully', game });
  } catch (error) {
    res.status(500).json({ message: 'Error making move', error: error.message });
  }
};

// Helper functions
const checkWinner = (board) => {
  // Check rows, columns, and diagonals for a winner
  for (let i = 0; i < 3; i++) {
    if (board[i][0] !== '-' && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return true;
    if (board[0][i] !== '-' && board[0][i] === board[1][i] && board[1][i] === board[2][i]) return true;
  }
  if (board[0][0] !== '-' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return true;
  if (board[0][2] !== '-' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return true;
  return false;
};

const isBoardFull = (board) => board.every((row) => row.every((cell) => cell !== '-'));

// Get game state
const getGameState = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId);

    if (!game) return res.status(404).json({ message: 'Game not found' });

    res.status(200).json({ game });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game state', error: error.message });
  }
};

// Match history
const getMatchHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const games = await Game.find({ $or: [{ player1: userId }, { player2: userId }] })
      .populate('player1', 'username')
      .populate('player2', 'username')
      .sort({ updatedAt: -1 });

    res.status(200).json({ games });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching match history', error: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true });
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

export { startGame, joinGame, makeMove, getGameState, getMatchHistory, updateUserProfile };
