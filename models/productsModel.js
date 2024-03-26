import { dbConnection } from "./database/db.js";

/**
 * ProductsModel provides methods for interacting with the 'productos' table in the database.
 */
export class ProductsModel {
    /**
     * Retrieves all products from the database.
     * @param {Object} params - Parameters for the query, including 'companyId'.
     * @returns {Array} - List of products.
     */

    static async getProducts({ companyId }) {
        try {
            const [products] = await dbConnection.query(
                "SELECT producto_id, nombre, precio, modelo, proveedor_id, stock, descripcion from productos WHERE empresa_id = ? ", [companyId]
            );
            return products;
        } catch (error) {
            return error.message;
        }
    }

    /**
     * Retrieves a product by its name and company ID from the database.
     * @param {Object} params - Parameters for the query, including 'name' and 'companyId'.
     * @returns {Object|null} - Product details or null if not found.
     */
    static async getProduct({ name, companyId }) {
        try {
            const products = await dbConnection.query(`
            SELECT producto_id, nombre, precio, modelo, proveedor_id, stock, descripcion from productos WHERE nombre LIKE ? and empresa_id = ?;`, ["%" + name + "%", companyId]);

            if (products.length === 0) return null;

            return products[0];

        } catch (error) {
            return error.message;
        }
    }

    /**
     * Creates a new product in the database.
     * @param {Object} params - Parameters for creating a product, including 'input' and 'companyId'.
     * @param {Object} input - Input object containing product details.
     * @returns {Object} - Newly created product details.
     * @throws {Error} - Throws an error if there is an issue creating the product.
     */
    static async createProduct({ input, companyId }) {
        const {
            nombre,
            precio,
            modelo,
            proveedor_id,
            stock,
            descripcion,
            numero_serie
        } = input;

        try {
            const newProduct = await dbConnection.query(
                "INSERT into productos (nombre, precio, modelo, proveedor_id, stock, descripcion, empresa_id, numero_serie) VALUES (?, ? ,?, ?, ?, ?, ?, ?);",
                [nombre, precio, modelo, proveedor_id, stock, descripcion, companyId, numero_serie]
            );
            return newProduct;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Deletes a product by its ID from the database.
     * @param {Object} params - Parameters for deleting a product, including 'id'.
     * @returns {Object|null} - Deletion status or null if the product is not found.
     */
    static async deleteProduct({ id }) {
        const [result] = await dbConnection.query("DELETE FROM productos WHERE producto_id = ?;", [id]);

        if (result.affectedRows === 0) return null;

        return result;
    }

    /**
     * Updates a product by its ID in the database.
     * @param {Object} params - Parameters for updating a product, including 'id' and 'input'.
     * @param {Object} input - Input object containing updated product details.
     * @returns {Object|null} - Update status or null if the product is not found.
     */
    static async updateProduct({ id, input }) {
        const {
            nombre,
            precio,
            modelo,
            stock,
            descripcion
        } = input;

        try {
            const [result] = await dbConnection.query(
                "UPDATE productos SET nombre = IFNULL(?, nombre), precio = IFNULL(?, precio), modelo = IFNULL(?, modelo), stock = IFNULL(?, stock), descripcion = IFNULL(?, descripcion) WHERE producto_id = ?",
                [nombre, precio, modelo, stock, descripcion, id]
            );

            if (result.affectedRows === 0) return null;

            return result;

        } catch (error) {
            return error.message;
        }

    }
}
