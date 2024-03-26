import { dbConnection } from "./database/db.js";

/**
 * CountriesModel class provides methods to interact with the 'paises' table in the database.
 */
export class CountriesModel {
    /**
     * Retrieves all countries from the database.
     * @returns {Promise<Array>} A promise that resolves to an array of country objects.
     */
    static async getCountries() {
        const [countries] = await dbConnection.query(
            "SELECT pais_id, nombre FROM paises"
        );
        return countries;
    }

    /**
     * Retrieves a specific country based on the provided ID.
     * @param {Object} params - Parameters for retrieving a country.
     * @param {number} params.id - The ID of the country to retrieve.
     * @returns {Promise<Object|null>} A promise that resolves to a country object or null if not found.
     */
    static async getCountry({ id }) {
        const [country] = await dbConnection.query(
            "SELECT pais_id, nombre FROM paises WHERE pais_id = ?;",
            [id]
        );

        if (country.length === 0) return null;

        return country[0];
    }
}
