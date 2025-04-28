import { z } from "zod";

export const schemaTypeSpecDecorators = z.object({
    items: z.array(z.string()).min(1).max(5),
    name: z.string().min(1).max(5),
    age: z.number().int().gte(1).lte(5),
    count: z.number().int().gt(1).lt(5)
});