import { z } from "zod";

export const schemaInternalServerError = z.interface({
    code: z.enum(["INTERNAL_SERVER_ERROR"]),
    message: z.string()
});

export const schemaNotFoundError = z.interface({
    code: z.enum(["NOT_FOUND"]),
    message: z.string()
});

export const schemaPetType = z.enum(["dog", "cat", "fish", "bird", "reptile"]);

export const schemaPet = z.interface({
    id: z.int32(),
    name: z.string().min(1),
    age: z.int32().gte(0).lte(100),
    get kind() {
        return schemaPetType;
    }
});

export const schemaValidationError = z.interface({
    code: z.enum(["VALIDATION_ERROR"]),
    message: z.string(),
    details: z.array(z.string())
});

export const pathPetsGet = z.interface({
    petId: z.int32()
});

export const pathPetsUpdate = z.interface({
    petId: z.int32()
});

export const pathPetsDelete = z.interface({
    petId: z.int32()
});