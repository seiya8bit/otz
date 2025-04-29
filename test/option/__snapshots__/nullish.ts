import { z } from "zod";

export const schemaExample = z.object({
    id: z.uuid(),
    name: z.string(),
    age: z.number().nullish()
});