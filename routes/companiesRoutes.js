import { Router } from "express";
import { CompaniesController } from "../controllers/companiesController.js";
import userExtractor from "../middlewares/userExtractor.js";

const router = Router();

const companiesController = new CompaniesController();

router.post("/api/companies/create", userExtractor, companiesController.createCompany);
router.delete("/api/companies/delete", userExtractor, companiesController.deleteCompany);
router.patch("/api/companies/update", userExtractor, companiesController.updateCompany);

export default router;