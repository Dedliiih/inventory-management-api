import z from "zod";

const permissionSchema = z.object({
    nombre: z.string({
        invalid_type_error: "Permission name must be a string",
        required_error: "Permission name is required"
    }),
    descripcion: z.string({
        invalid_type_error: "Permission description must be a string",
        required_error: "Permission description is required"
    })
});

export function validatePermission(input) {
    return permissionSchema.safeParse(input);
}

export function validatePartialPermission(input) {
    return permissionSchema.partial().safeParse(input);
}