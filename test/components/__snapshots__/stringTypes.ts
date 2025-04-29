import { z } from "zod";

export const schemaStringTypes = z.object({
    standardProperty: z.string().default("default value"),
    urlProperty: z.url().default("https://example.com")
});