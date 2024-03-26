import { CountriesModel } from "../models/countriesModel.js";
import { NotFoundError } from "../utils/errors/errors.js";

/**
 * CountriesController class handles HTTP requests related to countries.
 */
export class CountriesController {
    /**
     * Retrieves all countries and sends the list as JSON.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Promise<void>} A promise that resolves once the response is sent.
     */
    async getCountries(req, res) {
        try {
            const countries = await CountriesModel.getCountries();
            return res.json(countries);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    /**
     * Retrieves a specific country by ID and sends it as JSON.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Promise<void>} A promise that resolves once the response is sent.
     */
    async getCountry(req, res) {
        try {
            const { id } = req.params;
            const country = await CountriesModel.getCountry({ id });
            if (!country) throw new NotFoundError("Country not found");
            return res.json(country);
        } catch (error) {
            return res.status(404).json(error.message);
        }
    }
}
