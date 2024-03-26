import z from "zod";

const productSchema = z.object({
    nombre: z.string({
        invalid_type_error: "Product name must be a string",
        required_error: "Product name is required"
    }),
    modelo: z.string({
        invalid_type_error: "Product name must be a string",
        required_error: "Product name is required"
    }),
    precio: z.number({
        invalid_type_error: "Price must be a number",
        required_error: "Price is required"
    }).max(1000000000),
    proveedor_id: z.number({
        invalid_type_error: "Supplier ID  must be a number",
        required_error: "Supplier ID is required"
    }).int().positive(),
    stock: z.number({
        invalid_type_error: "Product stock must be a number",
        required_error: "Product stock is required"
    }).int().positive(),
    descripcion: z.string({
        invalid_type_error: "Description must be a string",
        required_error: "Description is required."
    }),
    numero_serie: z.number({
        invalid_type_error: "Serial number must be a number",
        required_error: "Serial number is required"
    })
});

export async function validateProduct(input) {
    return await productSchema.safeParseAsync(input);
}

export async function validatePartialProduct(input) {
    return await productSchema.partial().safeParseAsync(input);
}