import express from 'express';
import { startGame, joinGame, makeMove, getGameState ,getMatchHistory , updateUserProfile} from '../controllers/gameController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

// Start a new game
router.post('/start', protect, startGame);

// Join an existing game
router.post('/join/:gameId', protect, joinGame);

// Make a move in the game
router.post('/move', protect, makeMove);

// Get the game state
router.get('/:gameId', protect, getGameState);

//Get game history
router.get('/history', protect, getMatchHistory);

// update user profile
router.put('/profile', protect, updateUserProfile);

export default router;
