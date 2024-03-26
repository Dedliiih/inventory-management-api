import z from "zod";

const countrySchema = z.object({
    nombre: z.string({
        invalid_type_error: "Country name must be a string",
        required_error: "Country name is required"
    }).min(5, { message: "Must be 5 or more characters long" })
});

export async function validateCountry(input) {
    return countrySchema.safeParseAsync(input);
}