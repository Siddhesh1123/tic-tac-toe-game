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

// Put more specific routes first
router.get('/history', protect, getMatchHistory);  // This should come before /:gameId
router.get('/:gameId', protect, getGameState);
router.post('/start', protect, startGame);
router.post('/join/:gameId', protect, joinGame);
router.post('/move', protect, makeMove);

export default router;