import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  player1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  board: {
    type: [[String]],
    required: true,
    default: [
      ["-", "-", "-"],
      ["-", "-", "-"],
      ["-", "-", "-"],
    ],
  },
  status: {
    type: String,
    enum: ["waiting", "ongoing", "finished"],
    required: true,
    default: "waiting",
  },
  turn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
