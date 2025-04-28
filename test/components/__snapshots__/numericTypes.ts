import { z } from "zod";

export const schemaNumericTypes = z.object({
    numericProperty: z.number().default(0),
    integerProperty: z.number().default(0),
    floatProperty: z.number().default(0),
    int64Property: z.number().int().default(0),
    int32Property: z.number().int().default(0),
    int16Property: z.number().int().default(0),
    int8Property: z.number().int().default(0),
    safeintProperty: z.number().int().default(0),
    uint64Property: z.number().int().default(0),
    uint32Property: z.number().int().default(0),
    uint16Property: z.number().int().default(0),
    uint8Property: z.number().int().default(0),
    float32Property: z.number().default(0),
    float64Property: z.number().default(0),
    decimalProperty: z.number().default(0),
    decimal128Property: z.number().default(0)
});