import { UsersModel } from "../models/usersModel.js";
import { NotFoundError, UnauthorizedError } from "../utils/errors/errors.js";
import redisConnection from "../utils/redis.js";
import { COMPANY_ROLES } from "../utils/roles.js";

/**
 * Controller handling user-related operations.
 */

export class UsersController {
    /**
     * Get users associated with a specific company.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} - List of users and the count of users in JSON format.
     */
    async getCompanyUsers(req, res) {
        try {
            const companyId = req.user.companyId;

            // Checks if the user is part of a company
            if (!companyId) return res.status(404).json({ message: "You need to be in a company to see the users" });

            // Checks if the requested data already exists in the cache

            const dataExists = await redisConnection.get("companyUsers");
            if (dataExists) return res.send(JSON.parse(dataExists));

            const users = await UsersModel.getCompanyUsers({ companyId });
            const usersLength = users.length;

            // Send data to cache memory

            await redisConnection.set("companyUsers", JSON.stringify({ users, usersLength }), {
                EX: 1800,
            });
            return res.json({ users, usersLength });
        } catch (error) {
            return res.status(404).json(error.message);
        }
    }


    /**
     * Get a specific user by ID.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} - User details in JSON format.
     */
    async getCompanyUser(req, res) {
        try {
            const { name } = req.query; // Gets name from the query
            const companyId = req.user.companyId; // Gets the user's company identifier from the user's credentials

            // Checks if the user is part of a company
            if (!companyId) return res.status(404).json({ message: "You need to be in a company to see the users" });

            const user = await UsersModel.getCompanyUser({ name, companyId });
            if (!user) throw new NotFoundError("User not found");
            return res.json(user);
        } catch (error) {
            return res.status(404).json(error.message);
        }

    }

    /**
     * Delete a user by ID.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} - JSON object with a deletion message.
     */
    async deleteCompanyUser(req, res) {
        try {
            const { id } = req.params; // Gets user's id of the user to be deleted
            const { rolId } = req.user; // Gets user's rol to verifies if he/she has the required permissions to delete a user

            if (![COMPANY_ROLES.admin, COMPANY_ROLES.ceo].includes(rolId)) throw new UnauthorizedError("Unauthorized. Insufficient Permission");
            if (COMPANY_ROLES.ceo !== rolId) throw new UnauthorizedError("Unauthorized. Insufficient Permission");

            const deletedUser = await UsersModel.deleteCompanyUser({ id });
            if (!deletedUser) throw new NotFoundError("User not found");

            return res.status(200).json({ message: "User deleted" });
        } catch (error) {
            return res.status(404).json(error.message);
        }
    }

    async updateUserRolCompany(req, res) {
        try {
            const { id } = req.params; // Gets the id of the user whose role is to be updated
            const { rolId } = req.user; // Gets user's rol to verifies if he/she has the required permissions to update a user rol
            const { rol_id } = req.body; // Gets the new role id of the user whose role is to be updated

            if (![COMPANY_ROLES.admin, COMPANY_ROLES.ceo, COMPANY_ROLES.invMan].includes(rol_id)) throw new NotFoundError("Rol not found");
            if (![COMPANY_ROLES.ceo].includes(rolId)) throw new UnauthorizedError("Unauthorized. Insufficient Permission");

            const updatedUser = await UsersModel.updateUserRolCompany({ id, rol_id });

            if (!updatedUser) throw new NotFoundError("User not found");

            return res.status(200).json({ message: "User role succesfully updated" });
        } catch (error) {
            return res.status(404).json(error.message);
        }
    }

    /**
     * Add users to a specific company.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} - Newly added user details in JSON format.
     */
    async addCompanyUsers(req, res) {
        try {
            const { id } = req.params; // Gets the id of the user to be added to the company
            const { rolId, companyId } = req.user; // Gets user's rol to verifies if he/she has the required permissions to add a new user to the company, and gets the company of the user to be added to.

            if (![COMPANY_ROLES.admin, COMPANY_ROLES.ceo].includes(rolId)) throw new UnauthorizedError("Unauthorized. Insufficient Permission");

            const newCompanyUser = await UsersModel.addCompanyUsers({ id, companyId });

            if (!newCompanyUser) throw new NotFoundError("User not found");
            return res.status(200).json({ message: "User was added successfully" });
        } catch (error) {
            return res.status(404).json(error.message);
        }
    }

}
