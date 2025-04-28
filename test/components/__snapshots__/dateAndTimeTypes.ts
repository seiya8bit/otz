import { z } from "zod";

export const schemaDateAndTimeTypes = z.object({
    plainDateProperty: z.string().date().default("1970-01-01T00:00:00Z"),
    plainTimeProperty: z.string().time().default("1970-01-01T00:00:00Z"),
    utcDateTimeProperty: z.string().datetime().default("1970-01-01T00:00:00Z"),
    offsetDateTimeProperty: z.string().datetime().default("1970-01-01T00:00:00Z"),
    durationProperty: z.string().duration().default("P3Y6M4DT12H30M5S")
});
