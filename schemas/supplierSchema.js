import z from "zod";

const supplierSchema = z.object({
    pais_id: z.number({
        invalid_type_error: "Supplier country id must be a number",
        required_error: "Supplier country id is required"
    }),
    nombre: z.string({
        invalid_type_error: "Supplier name must be a string",
        required_error: "Supplier name is required"
    }),
    email: z.string({
        invalid_type_error: "Email must be a string",
        required_error: "Email is required"
    }).email({ message: "Invalid email address" }).max(50, { message: "Must be 50 or fewer characters long" }).regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, { message: "Email must contain only lowercase letters" })

});

export async function validateSupplier(input) {
    return await supplierSchema.safeParseAsync(input);
}

export async function validatePartialSupplier(input) {
    return await supplierSchema.partial().safeParseAsync(input);
}

