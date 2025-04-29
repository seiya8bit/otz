import { z } from "zod";

export const schemaInternalServerError = z.object({
    code: z.enum(["INTERNAL_SERVER_ERROR"]),
    message: z.string()
});

export const schemaNotFoundError = z.object({
    code: z.enum(["NOT_FOUND"]),
    message: z.string()
});

export const schemaPet = z.object({
    id: z.int32(),
    name: z.string().min(1),
    age: z.int32().gte(0).lte(100),
    kind: z.enum(["dog", "cat", "fish", "bird", "reptile"])
});

export const schemaValidationError = z.object({
    code: z.enum(["VALIDATION_ERROR"]),
    message: z.string(),
    details: z.array(z.string())
});

export const schemaPetType = z.enum(["dog", "cat", "fish", "bird", "reptile"]);

export const pathPetsGet = z.object({
    petId: z.int32()
});

export const pathPetsUpdate = z.object({
    petId: z.int32()
});

export const pathPetsDelete = z.object({
    petId: z.int32()
});