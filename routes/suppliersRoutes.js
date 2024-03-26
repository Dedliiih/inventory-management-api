import { SuppliersController } from "../controllers/suppliersController.js";
import { Router } from "express";
import userExtractor from "../middlewares/userExtractor.js";

const router = Router();

const supplierController = new SuppliersController();

router.get("/api/suppliers", userExtractor, supplierController.getSuppliers);
router.post("/api/suppliers/add", userExtractor, supplierController.createSupplier);
router.delete("/api/suppliers/delete/:id", userExtractor, supplierController.deleteSupplier);
router.patch("/api/suppliers/update/:id", userExtractor, supplierController.updateSupplier);

export default router;