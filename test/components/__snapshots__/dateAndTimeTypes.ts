import { z } from "zod";

export const schemaDateAndTimeTypes = z.object({
    plainDateProperty: z.iso.date().default("1970-01-01T00:00:00Z"),
    plainTimeProperty: z.iso.time().default("1970-01-01T00:00:00Z"),
    utcDateTimeProperty: z.iso.datetime().default("1970-01-01T00:00:00Z"),
    offsetDateTimeProperty: z.iso.datetime().default("1970-01-01T00:00:00Z"),
    durationProperty: z.iso.duration().default("P3Y6M4DT12H30M5S")
});