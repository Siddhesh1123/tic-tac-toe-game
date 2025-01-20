import mongoose from "mongoose";

// Define the schema for the game
const gameSchema = new mongoose.Schema({
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // First player is mandatory
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Second player can be null until joined
  },
  board: {
    type: [[String]], // 3x3 board represented as a 2D array of strings
    required: true,
    default: [
      ["-", "-", "-"], // Default empty board
      ["-", "-", "-"],
      ["-", "-", "-"],
    ],
  },
  status: {
    type: String,
    enum: ["waiting", "ongoing", "finished"], // Game can be in one of these states
    required: true,
    default: "waiting", // Default status when the game is created
  },
  turn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Indicates which player's turn it is
  },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  moveHistory: [
    {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      move: {
        row: Number,
        column: Number,
      },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

// Creating the model from the game schema
const Game = mongoose.model("Game", gameSchema);
export default Game;
