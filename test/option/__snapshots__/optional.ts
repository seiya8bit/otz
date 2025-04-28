import { z } from "zod";

export const schemaExample = z.object({
    id: z.string().uuid(),
    name: z.string(),
    age: z.number().int().optional()
});