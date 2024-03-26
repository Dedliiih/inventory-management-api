import { dbConnection } from "./database/db.js";

/**
 * SuppliersModel provides methods for interacting with the 'proveedores' table in the database.
 */
export class SuppliersModel {
    /**
   * Retrieves all suppliers from the database.
   * @returns {Array} - List of suppliers.
   */
    static async getSuppliers({ companyId }) {
        const [suppliers] = await dbConnection.query("SELECT proveedor_id, pais_id, nombre, email from proveedores WHERE empresa_id = ?", [companyId]);
        return suppliers;
    }

    /**
   * Creates a new supplier in the database.
   * @param {Object} input - Input object containing supplier details.
   * @returns {Object} - Newly created supplier details.
   * @throws {Error} - Throws an error if there is an issue creating the supplier.
   */
    static async createSupplier({ input, companyId }) {
        const { pais_id, nombre, email } = input;
        try {
            const newSupplier = await dbConnection.query(
                "INSERT into proveedores (pais_id, nombre, empresa_id, email) VALUES (?, ?, ?, ?);",
                [pais_id, nombre, companyId, email]
            );
            return newSupplier;
        } catch (error) {
            return error.message;
        }
    }

    /**
   * Deletes a supplier by its ID from the database.
   * @param {Object} params - Parameters for the query, including 'id'.
   * @returns {Object|null} - Deletion status or null if the supplier is not found.
   */
    static async deleteSupplier({ id, companyId }) {
        const [result] = await dbConnection.query("DELETE FROM proveedores WHERE proveedor_id = ? AND empresa_id;", [id, companyId]);

        if (result.affectedRows === 0) return null;

        return result;
    }

    /**
   * Updates a supplier by its ID in the database.
   * @param {Object} params - Parameters for the query, including 'id'.
   * @param {Object} input - Input object containing updated supplier details.
   * @returns {Object|null} - Update status or null if the supplier is not found.
   */
    static async updateSupplier({ id, input, companyId }) {
        const { nombre, email } = input;

        const [result] = await dbConnection.query(
            "UPDATE proveedores SET nombre = IFNULL(?, nombre), email = IFNULL(?, email) WHERE proveedor_id = ? AND empresa_id = ?;",
            [nombre, email, id, companyId]
        );

        if (result.affectedRows === 0) return null;

        return result;
    }
}
