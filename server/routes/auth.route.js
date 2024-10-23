import express from 'express';
import { signin, signup, google, signout, refreshAccessToken} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/verifyUser.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", verifyToken, signout);
router.post("/refresh-token", refreshAccessToken);

export default router;