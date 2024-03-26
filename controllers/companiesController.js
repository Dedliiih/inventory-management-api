import { CompaniesModel } from "../models/companiesModel.js";
import { validateCompany, validatePartialCompany } from "../schemas/companySchema.js";
import { AlreadyExistsError, NotFoundError, UnauthorizedError } from "../utils/errors/errors.js";
import { COMPANY_ROLES } from "../utils/roles.js";
import { generateNewToken } from "../utils/updateToken.js";

/**
 * Controller class for managing company-related operations.
 */
export class CompaniesController {

    /**
     * Create a new company.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} - Newly created company details in JSON format.
     */
    async createCompany(req, res) {
        try {
            // Get data from the current token
            const userId = req.user.id;
            const validation = await validateCompany(req.body);
            if (!validation.success) return res.status(400).json({ error: JSON.parse(validation.error.message) });

            const { nombre, email, telefono } = req.body;

            // Checks if the company already exists in the database verifying name, email and phonenumber

            const existingCompany = await CompaniesModel.existingCompany({ nombre, email, telefono });

            if (existingCompany) throw new AlreadyExistsError("A company with this name, e-mail address, or telephone number already exists.");

            // Send SQL query with the input data, user id and the user role

            const { companyId } = await CompaniesModel.createCompany({ input: validation.data, userId, rol: COMPANY_ROLES.ceo });

            // Updates Json Web Token

            const userData = {
                id: req.user.id,
                username: req.user.username,
                companyId: companyId,
                rolId: COMPANY_ROLES.ceo
            };

            const newToken = generateNewToken(userData);

            return res.status(201).json({ message: "Your company was created successfully", token: newToken });
        } catch (error) {
            return res.status(400).json(error.message);
        }
    }

    /**
     * Delete a company by ID.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} - JSON object with a deletion message.
     */
    async deleteCompany(req, res) {
        try {
            // Get data from the current token
            const { rolId, companyId } = req.user;

            // Verifies if the user has valid permissions

            if (rolId !== COMPANY_ROLES.ceo) throw new UnauthorizedError("Unauthorized. Insufficient Permission", res.status(401));

            await CompaniesModel.deleteCompany({ companyId });

            // Updates Json web token

            const userData = {
                id: req.user.id,
                username: req.user.username,
                companyId: null,
                rolId: null
            };

            const newToken = generateNewToken(userData);

            return res.status(200).json({ message: "Company deleted", token: newToken });
        } catch (error) {
            res.json(error.message);
        }
    }

    /**
     * Update a company by ID.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} - JSON object with an update message.
     */
    async updateCompany(req, res) {
        try {
            // Get data from the current token
            const { rolId, companyId } = req.user;

            // Verifies if the user has valid permissions

            if (rolId !== COMPANY_ROLES.ceo) throw new UnauthorizedError("Unauthorized. Insufficient Permission", res.status(401));

            // Validates the information sent

            const validation = await validatePartialCompany(req.body);
            if (!validation.success) return res.status(404).json({ error: JSON.parse(validation.error.message) });

            const updatedCompany = await CompaniesModel.updateCompany({ companyId, input: validation.data });

            if (!updatedCompany) throw new NotFoundError("Company not found");
            return res.status(200).json({ message: "Company updated" });
        } catch (error) {
            res.json(error.message);
        }
    }

}
