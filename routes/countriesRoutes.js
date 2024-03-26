import { Router } from "express";
import { CountriesController } from "../controllers/countriesController.js";

const router = Router();

const countriesController = new CountriesController();

router.get("/api/countries", countriesController.getCountries);
router.get("/api/countries/:id", countriesController.getCountry);

export default router;