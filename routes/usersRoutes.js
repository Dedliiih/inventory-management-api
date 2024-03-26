import { Router } from "express";
import { UsersController } from "../controllers/usersController.js";
import userExtractor from "../middlewares/userExtractor.js";

const router = Router();

const usersController = new UsersController();

router.get("/api/company/users", userExtractor, usersController.getCompanyUsers);
router.get("/api/company/users/search", userExtractor, usersController.getCompanyUser);
router.patch("/api/company/users/update/:id", userExtractor, usersController.updateUserRolCompany);
router.patch("/api/company/users/delete/:id", userExtractor, usersController.deleteCompanyUser);
router.patch("/api/company/users/add/:id", userExtractor, usersController.addCompanyUsers);

export default router;