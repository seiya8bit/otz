import { z } from "zod";

export const schemaNumericTypes = z.interface({
    numericProperty: z.number().default(0),
    integerProperty: z.number().default(0),
    floatProperty: z.number().default(0),
    int64Property: z.number().default(0),
    int32Property: z.int32().default(0),
    int16Property: z.number().default(0),
    int8Property: z.number().default(0),
    safeintProperty: z.number().default(0),
    uint64Property: z.uint64().default(0n),
    uint32Property: z.uint32().default(0),
    uint16Property: z.int().default(0),
    uint8Property: z.int().default(0),
    float32Property: z.float32().default(0),
    float64Property: z.float64().default(0),
    decimalProperty: z.number().default(0),
    decimal128Property: z.number().default(0)
});