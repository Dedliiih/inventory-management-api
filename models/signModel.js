import { dbConnection } from "./database/db.js";

export class SignModel {
    /**
    * Registers a new user in the database.
    * @param {Object} param - Parameters for registering a user.
    * @param {string} param.hashPassword - Hashed user password.
    * @param {Object} param.input - User details.
    * @param {string} param.input.nombre_usuario - User username.
    * @param {string} param.input.nombre - User first name.
    * @param {string} param.input.apellidos - User last name.
    * @param {string} param.input.email - User email.
    * @param {string} param.input.telefono - User phone number.
    * @returns {Promise<Object>} - Result of the database insertion.
    */
    static async registerUser({ hashPassword, input }) {
        const {
            nombre_usuario,
            nombre,
            apellidos,
            email,
            telefono,
        } = input;
        const date = new Date();

        try {
            const newUser = await dbConnection.query(
                "INSERT into usuarios (nombre_usuario, nombre, apellidos, contraseña, email, telefono, fecha) VALUES (?, ?, ?, ?, ?, ?, ?)", [nombre_usuario, nombre, apellidos, hashPassword, email, telefono, date]
            );

            return newUser;
        } catch (error) {
            return error.message;
        }

    }

}