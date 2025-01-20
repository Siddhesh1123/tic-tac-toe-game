import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { 
    startGame, 
    joinGame, 
    makeMove, 
    getGameState, 
    getMatchHistory 
} from '../controllers/gameController.js';

const router = express.Router();

// Get Match History : Protected route to fetch user's game history
router.get('/history', protect, getMatchHistory);

// Get Game State : Protected route to fetch the current state of a specific game
router.get('/:gameId', protect, getGameState);

// Start New Game : Protected route to initialize a new game
router.post('/start', protect, startGame);

// Join Existing Game : Protected route to join an existing game using game ID
router.post('/join/:gameId', protect, joinGame);

// Make a Move : Protected route to submit a move in the game
router.post('/move', protect, makeMove);

export default router;
