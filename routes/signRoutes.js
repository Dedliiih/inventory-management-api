import { Router } from "express";
import { SignController } from "../controllers/signController.js";
import rateLimiter from "../middlewares/rateLimiter.js";
import rateLimitExceeded from "../middlewares/limitLogger.js";

const router = Router();
const signController = new SignController();

router.post("/api/login", rateLimiter, rateLimitExceeded, signController.loginController);
router.post("/api/register", rateLimiter, rateLimitExceeded, signController.registerController);

export default router;