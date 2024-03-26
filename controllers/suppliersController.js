import { SuppliersModel } from "../models/suppliersModel.js";
import { validateSupplier, validatePartialSupplier } from "../schemas/supplierSchema.js";
import { NotFoundError, UnauthorizedError } from "../utils/errors/errors.js";
import redisConnection from "../utils/redis.js";
import { COMPANY_ROLES } from "../utils/roles.js";

/**
 * SuppliersController handles HTTP requests related to suppliers.
 */
export class SuppliersController {
    /**
   * Retrieves all suppliers.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {JSON} - List of suppliers.
   */
    async getSuppliers(req, res) {
        try {
            const companyId = req.user.companyId;
            // Checks if the user is part of a company
            if (!companyId) return res.status(404).json({ message: "You need to be in a company to see the users" });

            // Checks if the requested data already exists in the cache

            const dataExists = await redisConnection.get("companyUsers");
            if (dataExists) return res.send(JSON.parse(dataExists));

            const suppliers = await SuppliersModel.getSuppliers({ companyId });

            // Send data to cache memory

            await redisConnection.set("companySuppliers", JSON.stringify({ suppliers }), {
                EX: 1800,
            });
            return res.json(suppliers);
        } catch (error) {
            return res.status(404).json(error.message);
        }
    }

    /**
   * Creates a new supplier.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {JSON} - Newly created supplier.
   */
    async createSupplier(req, res) {
        try {
            const { rolId, companyId } = req.user;
            const validation = await validateSupplier(req.body);

            if (![COMPANY_ROLES.admin, COMPANY_ROLES.ceo].includes(rolId)) throw new UnauthorizedError("Unauthorized. Insufficient Permission");

            if (!validation.success) return res.status(400).json({ error: JSON.parse(validation.error.message) });

            await SuppliersModel.createSupplier({ input: validation.data, companyId });

            // Clears the cache to update it

            redisConnection.del("companySuppliers");

            return res.status(201).json({ message: "New supplier added succesfully" });
        } catch (error) {
            return res.status(400).json(error.message);
        }
    }

    /**
   * Deletes a supplier by ID.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {JSON} - Deletion status.
   */
    async deleteSupplier(req, res) {
        try {
            const { id } = req.params;
            const { rolId, companyId } = req.user;

            if (![COMPANY_ROLES.admin, COMPANY_ROLES.ceo].includes(rolId)) throw new UnauthorizedError("Unauthorized. Insufficient Permission");

            const deletedSupplier = await SuppliersModel.deleteSupplier({ id, companyId });
            if (!deletedSupplier) throw new NotFoundError("Supplier not found");

            // Clears the cache to update it

            redisConnection.del("companySuppliers");

            return res.json({ message: "Supplier deleted" });
        } catch (error) {
            return res.status(400).json(error.message);
        }
    }

    /**
   * Updates a supplier by ID with partial data.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {JSON} - Update status.
   */
    async updateSupplier(req, res) {
        try {
            const { id } = req.params;
            const { rolId, companyId } = req.user;

            if (![COMPANY_ROLES.admin, COMPANY_ROLES.ceo].includes(rolId)) throw new UnauthorizedError("Unauthorized. Insufficient Permission");

            const validation = await validatePartialSupplier(req.body);

            if (!validation.success) return res.status(400).json({ error: JSON.parse(validation.error.message) });
            const updatedSupplier = await SuppliersModel.updateSupplier({ id, input: validation.data, companyId });

            if (!updatedSupplier) throw new NotFoundError("Supplier not found");

            // Clears the cache to update it

            redisConnection.del("companySuppliers");

            return res.status(200).json({ message: "Supplier updated" });
        } catch (error) {
            return res.status(404).json(error.message);
        }
    }
}
