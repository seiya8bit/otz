import { z } from "zod";

export const schemaTypeSpecDecorators = z.interface({
    items: z.array(z.string()).min(1).max(5),
    name: z.string().min(1).max(5),
    age: z.int().gte(1).lte(5),
    count: z.int().gt(1).lt(5)
});