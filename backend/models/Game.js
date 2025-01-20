import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  board: {
    type: [[String]],
    required: true,
    default: [
      ['-', '-', '-'],
      ['-', '-', '-'],
      ['-', '-', '-']
    ]
  },
  status: { type: String, enum: ['waiting', 'ongoing', 'finished'], required: true, default: 'waiting' },
  winner: { type: String }, // 'player1', 'player2', or 'draw'
  turn: { type: String, enum: ['player1', 'player2'], default: 'player1' },
  moveHistory: [
    {
      player: { type: String },
      row: { type: Number },
      column: { type: Number },
      timestamp: { type: Date, default: Date.now },
    },
  ],
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Game = mongoose.model('Game', gameSchema);
export default Game;
