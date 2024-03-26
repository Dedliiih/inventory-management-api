import z from "zod";

const companySchema = z.object({
    nombre: z.string({
        invalid_type_error: "Company name must be a string",
        required_error: "Companay name is required"
    }).min(5, { message: "Must be 30 or more characters long" }),
    email: z.string({
        invalid_type_error: "Email must be a string",
        required_error: "Email is required"
    }).email({ message: "Invalid email address" }),
    telefono: z.number({
        invalid_type_error: "Phone number must be a number",
        required_error: "Phone number is required"
    }).lte(99999999999).int().positive()
});

export async function validateCompany(input) {
    return await companySchema.safeParseAsync(input);
}

export async function validatePartialCompany(input) {
    return await companySchema.partial().safeParseAsync(input);
}