import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import process from "node:process";
import "dotenv/config.js";
import { UsersModel } from "../models/usersModel.js";
import { LoginError } from "../utils/errors/errors.js";
import { validateUser } from "../schemas/userSchema.js";
import { SignModel } from "../models/signModel.js";
/**
 * Controller class for user authentication and registration.
 */
export class SignController {
    /**
     * Handles user login.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} - User details and authentication token in JSON format.
     */
    async loginController(req, res) {
        try {
            const { username, password } = req.body;

            // Retrieves user from the database by username
            const user = await UsersModel.getUserByName({ username });

            // Checks if the user exists and if the provided password is correct
            const isCorrect = user === null
                ? false
                : await bcrypt.compare(password, user.contraseña);

            // Throws an error if user or password is invalid
            if (!(user && isCorrect)) throw new LoginError("Invalid user or password");

            // Prepares user data for generating JWT token
            const userForToken = {
                id: user.usuario_id,
                username: user.nombre_usuario,
                companyId: user.empresa_id,
                rolId: user.rol_id
            };

            // Generates JWT token
            const token = jwt.sign(
                userForToken,
                process.env.SECRET,
                {
                    expiresIn: 60 * 60 * 24 * 7
                }
            );

            // Sends user details and token in response
            res.send({
                name: user.nombre,
                username: user.nombre_usuario,
                token
            });
        } catch (error) {
            // Handles error if any occurs during login process
            return res.status(401).json(error.message);
        }
    }

    /**
     * Handles user registration.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} - Success message in JSON format if registration is successful.
     */
    async registerController(req, res) {
        try {
            // Validates user input data
            const validation = await validateUser(req.body);
            const { contraseña } = req.body;

            // Returns validation error if input data is invalid
            if (!validation.success) return res.status(400).json({ error: JSON.parse(validation.error.message) });

            // Hashes password for security
            const hashPassword = await bcrypt.hash(contraseña, 10);

            // Registers user in the database
            await SignModel.registerUser({ hashPassword, input: validation.data });

            // Sends success message if registration is successful
            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            // Handles error if any occurs during registration process
            res.status(400).json(error.message);
        }
    }
}