import { ProductsModel } from "../models/productsModel.js";
import {
    validatePartialProduct,
    validateProduct,
} from "../schemas/productsSchema.js";
import { NotFoundError, UnauthorizedError } from "../utils/errors/errors.js";
import redisConnection from "../utils/redis.js";

/**
 * ProductsController handles HTTP requests related to products.
 */
export class ProductsController {
    /**
     * Retrieves all products.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {JSON} - List of products.
     */
    async getProducts(req, res) {
        try {

            // Checks if the user is part of a company

            const companyId = req.user.companyId;
            if (!companyId) return res.status(404).json({ message: "You need to be in a company to see the products" });

            // Checks if the requested data already exists in the cache

            const dataExists = await redisConnection.get("companyProducts");
            if (dataExists) return res.send(JSON.parse(dataExists));

            const products = await ProductsModel.getProducts({ companyId });
            const productsLength = products.length;

            // Send data to cache memory
            await redisConnection.set("companyProducts", JSON.stringify({ products, productsLength }), { EX: 1800 });
            return res.json({ products, productsLength });
        } catch (error) {
            return res.status(404).json(error.message);
        }
    }

    /**
     * Retrieves a product by ID.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {JSON} - Product details.
     */
    async getProduct(req, res) {
        try {
            const { name } = req.query; // Gets the product name from the request
            const companyId = req.user.companyId; // Gets the user's company identifier from the user's credentials

            // Checks if the user is part of a company

            if (!companyId) return res.status(404).json({ message: "You need to be in a company to see the products" });

            const product = await ProductsModel.getProduct({ name, companyId });
            if (!product) throw new NotFoundError("Product not found");
            return res.json(product);
        } catch (error) {
            return res.status(404).json(error.message);
        }
    }

    /**
     * Creates a new product.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {JSON} - Newly created product.
     */
    async createProduct(req, res) {
        try {
            const companyId = req.user.companyId; // Gets the user's company identifier from the user's credentials

            // Checks if the user is authorized to create a product

            if (!req.user.rolId) throw new UnauthorizedError("Unauthorized. Insufficient Permission");

            // Checks if the user is part of a company

            if (!companyId) return res.status(404).json({ message: "You need to be in a company to add products" });

            const validation = await validateProduct(req.body);
            if (!validation.success) return res.status(400).json({ error: JSON.parse(validation.error.message) });
            await ProductsModel.createProduct({ input: validation.data, companyId });

            // Clears the cache to update it

            redisConnection.del("companyProducts");

            return res.status(201).json({ message: "New product was created" });
        } catch (error) {
            return res.status(404).json(error.message);
        }
    }

    /**
     * Deletes a product by ID.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {JSON} - Deletion status.
     */
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;

            // Checks if the user is authorized to delete a product

            if (!req.user.rolId) throw new UnauthorizedError("Unauthorized. Insufficient Permission");

            // Checks if the user is part of a company

            if (!req.user.companyId) return res.status(404).json({ message: "You need to be in a company to delete products" });

            const deletedProduct = await ProductsModel.deleteProduct({ id });
            if (!deletedProduct) throw new NotFoundError("Product not found");

            // Clears the cache to update it

            redisConnection.del("companyProducts");

            return res.status(200).json({ message: "Product deleted" });
        } catch (error) {
            return res.status(404).json(error.message);
        }
    }

    /**
     * Updates a product by ID with partial data.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {JSON} - Update status.
     */
    async updateProduct(req, res) {
        try {

            // Checks if the user is authorized to delete a product

            if (!req.user.rolId) throw new UnauthorizedError("Unauthorized. Insufficient Permission");

            // Checks if the user is part of a company

            if (!req.user.companyId) return res.status(404).json({ message: "You need to be in a company to update products" });

            const result = await validatePartialProduct(req.body);
            if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

            const { id } = req.params;
            await ProductsModel.updateProduct({ id, input: result.data });

            const updatedProduct = await ProductsModel.getProduct({ id });

            if (!updatedProduct) throw new NotFoundError("Product not found");

            // Clears the cache to update it

            redisConnection.del("companyProducts");

            return res.status(200).json({ message: "Product updated" });
        } catch (error) {
            return res.status(404).json(error.message);
        }
    }
}
