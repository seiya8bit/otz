import { z } from "zod";

export const schemaExample = z.interface({
    id: z.uuid(),
    name: z.string(),
    age: z.number().optional()
});