import { dbConnection } from "./database/db.js";

/**
 * Represents the data model for users in the database.
 */
export class UsersModel {
    /**
     * Retrieves all users belonging to a specific company from the database.
     * @param {Object} param - Parameters for the query.
     * @param {number} param.companyId - Company ID.
     * @returns {Promise<Array>} - Array of users belonging to the company.
     */
    static async getCompanyUsers({ companyId }) {
        const [users] = await dbConnection.query(
            `SELECT u.nombre, u.apellidos, u.email, r.nombre AS rol
            FROM usuarios u
            LEFT JOIN roles r ON u.rol_id = r.rol_id
            LEFT JOIN permisosxroles pr ON r.rol_id = pr.rol_id
            LEFT JOIN permisos p ON pr.permiso_id = p.permiso_id
            WHERE u.empresa_id = ?;`, [companyId]
        );

        return users;
    }

    /**
     * Retrieves a specific user by name from the database.
     * @param {Object} param - Parameters for the query.
     * @param {string} param.name - User name.
     * @param {number} param.companyId - Company ID.
     * @returns {Promise<Object|null>} - User details or null if not found.
     */
    static async getCompanyUser({ name, companyId }) {
        const user = await dbConnection.query(
            `SELECT u.nombre, u.apellidos, u.email, r.nombre AS rol
            FROM usuarios u
            INNER JOIN roles r ON u.rol_id = r.rol_id
            WHERE CONCAT(u.nombre, ' ', u.apellidos) LIKE ? AND empresa_id = ?;`, ["%" + name + "%", companyId]
        );

        if (user.length === 0) return null;

        return user[0];
    }

    /**
     * Retrieves a user by username from the database.
     * @param {Object} param - Parameters for the query.
     * @param {string} param.username - User username.
     * @returns {Promise<Object|null>} - User details or null if not found.
     */
    static async getUserByName({ username }) {
        const [user] = await dbConnection.query(
            "SELECT usuario_id, nombre_usuario, nombre, apellidos, contraseña, email, telefono, activo, fecha, empresa_id, rol_id from usuarios WHERE nombre_usuario = ?", [username]
        );

        if (user.length === 0) return null;

        return user[0];
    }


    /**
     * Deletes a user from the database by ID.
     * @param {Object} param - Parameters for deleting a user.
     * @param {number} param.id - User ID.
     * @returns {Promise<Object|null>} - Result of the database deletion or null if user not found.
     */
    static async deleteCompanyUser({ id }) {
        const [result] = await dbConnection.query(
            "UPDATE usuarios SET empresa_id = NULL, rol_id = NULL WHERE usuario_id = ?", [id]
        );

        if (result.affectedRows === 0) return null;

        return result;
    }

    /**
     * Updates a user in the database by ID.
     * @param {Object} param - Parameters for updating a user.
     * @param {number} param.id - User ID.
     * @param {number} param.rol_id - Updated user role ID.
     * @returns {Promise<Object|null>} - Result of the database update or null if user not found.
     */
    static async updateUserRolCompany({ rol_id, id }) {

        const [result] = await dbConnection.query(
            "UPDATE usuarios SET rol_id = ? WHERE usuario_id = ?", [rol_id, id]
        );

        if (result.affectedRows === 0) return null;

        return result;
    }

    /**
     * Adds a user to a specific company in the database.
     * @param {Object} param - Parameters for adding a user to a company.
     * @param {number} param.id - User ID.
     * @param {number} param.companyId - Company ID.
     * @returns {Promise<Object|null>} - Result of the database update or null if user not found.
     */
    static async addCompanyUsers({ id, companyId }) {

        const [result] = await dbConnection.query(
            "UPDATE usuarios SET empresa_id = ? WHERE usuario_id = ?;", [companyId, id]
        );

        if (result.affectedRows === 0) return null;

        return result;
    }
}
