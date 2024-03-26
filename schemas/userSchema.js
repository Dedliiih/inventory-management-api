import z from "zod";

const containSpaces = (username) => {
    if (username.includes(" ")) throw new Error("Does not have to contain spaces");
    return username;
};

const userSchema = z.object({
    nombre_usuario: z.string({
        invalid_type_error: "Username must be a string",
        required_error: "Username is required"
    }).refine(containSpaces, { message: "Does not have to contain spaces" }),
    nombre: z.string({
        invalid_type_error: "Name must be a string",
        required_error: "Name is required"
    }),
    apellidos: z.string({
        invalid_type_error: "Lastname name must be a string",
        required_error: "Lastname is required"
    }),
    contraseña: z.string({
        invalid_type_error: "Password must be a string",
        required_error: "Password is required"
    }).min(7, {
        message: "Must be 7 or more characters long"
    }).regex(/^(?=.*[!@#$%^&*()_+{}[\]:;<>,.?\\~-])[A-Za-z0-9!@#$%^&*()_+{}[\]:;<>,.?\\~-]+$/, { message: "Must contain at least one special character" }),
    email: z.string({
        invalid_type_error: "Email must be a string",
        required_error: "Email is required"
    }).email({ message: "Invalid email address" }).max(50, { message: "Must be 50 or fewer characters long" }).regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, { message: "Email must contain only lowercase letters" }),
    telefono: z.number({
        invalid_type_error: "Phone number must be a number",
        required_error: "Phone number is required"
    }).lte(99999999999).int().positive(),
});

export async function validateUser(input) {
    return await userSchema.safeParseAsync(input);
}

export async function validatePartialUser(input) {
    return await userSchema.partial().safeParseAsync(input);
}