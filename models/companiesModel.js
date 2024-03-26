import { dbConnection } from "./database/db.js";

/**
 * Class representing the data model for companies in the database.
 */
export class CompaniesModel {

    /**
     * Check if a company with the given name, email, or phone number already exists in the database.
     * @param {Object} param - Parameters for checking existing company.
     * @param {string} param.nombre - Company name.
     * @param {string} param.email - Company email.
     * @param {string} param.telefono - Company phone number.
     * @returns {Promise<Object|null>} - Existing company details or null if not found.
     */
    static async existingCompany({ nombre, email, telefono }) {
        const [existingCompany] = await dbConnection.query("SELECT empresa_id, nombre, fecha, email, telefono FROM empresas WHERE nombre = ?  OR email = ? OR telefono = ?", [nombre, email, telefono]);

        if (existingCompany === null) return null;

        return existingCompany[0];
    }

    /**
     * Create a new company in the database.
     * @param {Object} param - Parameters for creating a company.
     * @param {Object} param.input - Company details.
     * @param {string} param.input.nombre - Company name.
     * @param {string} param.input.email - Company email.
     * @param {string} param.input.telefono - Company phone number.
     * @param {number} param.userId - ID of the user creating the company.
     * @param {number} param.rol - Role of the user creating the company.
     * @returns {Promise<Object>} - Object containing the result of the database insertion and the ID of the newly created company.
     */
    static async createCompany({ input, userId, rol }) {
        await dbConnection.beginTransaction();
        const {
            nombre,
            email,
            telefono
        } = input;

        const date = new Date();

        try {
            const [newCompany] = await dbConnection.query(
                "INSERT into empresas (nombre, fecha, email, telefono, creador_id) VALUES(?, ?, ?, ?, ?);", [nombre, date, email, telefono, userId]
            );

            // Assigns the owner of the company the role of CEO

            await dbConnection.query(
                "UPDATE usuarios SET rol_id = ? WHERE usuario_id = ?", [rol, userId]
            );

            // Adds the owner of the company to the created company

            await dbConnection.query(
                "UPDATE usuarios SET empresa_id = ? WHERE usuario_id = ?", [newCompany.insertId, userId]
            );

            await dbConnection.commit();

            return { newCompany, companyId: newCompany.insertId };
        } catch (error) {
            await dbConnection.rollback();
            return error.message;
        }
    }

    /**
     * Delete a company from the database by ID.
     * @param {Object} param - Parameters for deleting a company.
     * @param {number} param.companyId - ID of the company to delete.
     * @param {number} param.id - ID of the user deleting the company.
     * @returns {Promise<Object>} - Object containing the result of the database deletion.
     */
    static async deleteCompany({ companyId }) {
        await dbConnection.beginTransaction();
        try {
            // Set to NULL rol_id and company_id to all users that were in the company

            await dbConnection.query("UPDATE usuarios SET rol_id = NULL, empresa_id = NULL WHERE empresa_id = ?", [companyId]);

            // Deletes all products that were in the deleted company

            await dbConnection.query("DELETE FROM productos WHERE empresa_id = ?", [companyId]);

            // Deletes all suppliers that were in the deleted company

            await dbConnection.query("DELETE FROM proveedores WHERE empresa_id = ?", [companyId]);

            const [result] = await dbConnection.query(
                "DELETE FROM empresas WHERE empresa_id = ?;", [companyId]
            );

            await dbConnection.commit();

            return result;
        } catch (error) {
            await dbConnection.rollback();
            return error.message;
        }
    }

    /**
     * Update a company in the database by ID.
     * @param {Object} param - Parameters for updating a company.
     * @param {number} param.id - ID of the company to update.
     * @param {Object} param.input - Updated company details.
     * @param {string} param.input.nombre - Updated company name.
     * @param {string} param.input.email - Updated company email.
     * @param {string} param.input.telefono - Updated company phone number.
     * @returns {Promise<Object>} - Object containing the result of the database update.
     */
    static async updateCompany({ companyId, input }) {
        const {
            nombre,
            email,
            telefono
        } = input;

        try {
            const [result] = await dbConnection.query(
                "UPDATE empresas SET nombre = IFNULL(?, nombre), email = IFNULL(?, email), telefono = IFNULL(?, telefono) WHERE empresa_id = ?;", [nombre, email, telefono, companyId]
            );

            if (result.affectedRows === 0) return null;

            return result;
        } catch (error) {
            return error.message;
        }


    }
}
