import { z } from "zod";

export const schemaOtherCoreTypes = z.interface({
    bytesProperty: z.string(),
    stringProperty: z.string().default("default value"),
    booleanProperty: z.boolean().default(true),
    nullProperty: z.unknown(),
    ArrayProperty: z.array(z.number()).default([0, 1, 2]),
    unknownProperty: z.unknown()
});