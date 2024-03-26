import z from "zod";

const rolSchema = z.object({
    nombre: z.string({
        invalid_type_error: "Rol name must be a string",
        required_error: "Rol name is required"
    }),
    descripcion: z.string({
        invalid_type_error: "Rol description must be a string",
        required_error: "Rol description is required"
    })
});

export function validateRol(input) {
    return rolSchema.safeParse(input);
}

export function validatePartialRol(input) {
    return rolSchema.partial().safeParse(input);
}