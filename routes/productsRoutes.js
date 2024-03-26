import { Router } from "express";
import { ProductsController } from "../controllers/productsController.js";
import userExtractor from "../middlewares/userExtractor.js";

const router = Router();

const productController = new ProductsController();

router.get("/api/products", userExtractor, productController.getProducts);
router.get("/api/products/search", userExtractor, productController.getProduct);
router.post("/api/products", userExtractor, productController.createProduct);
router.patch("/api/products/update/:id", userExtractor, productController.updateProduct);
router.delete("/api/products/delete/:id", userExtractor, productController.deleteProduct);

export default router;


