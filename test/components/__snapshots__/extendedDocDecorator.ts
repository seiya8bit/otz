import { z } from "zod";

export const schemaExtendedSyntaxForDocDecorator = z.interface({
    // Username
    name: z.string().min(2, { message: 'Must be 2 or more characters long' })
});