# Supported TypeSpec built-in types

See [Built-in types | TypeSpec](https://typespec.io/docs/language-basics/built-in-types/).

### Numeric types

These are the mappings from TypeSpec numeric types to Zod:

| TypeSpec Type  |  Zod Type Conversion  |
|----------------|-----------------------|
| numeric        | z.number()            |
| integer        | z.number()            |
| float          | z.number()            |
| int64          | z.number().int()      |
| int32          | z.number().int()      |
| int16          | z.number().int()      |
| int8           | z.number().int()      |
| safeint        | z.number().int()      |
| uint64         | z.number().int()      |
| uint32         | z.number().int()      |
| uint16         | z.number().int()      |
| uint8          | z.number().int()      |
| float32        | z.number()            |
| float64        | z.number()            |
| decimal        | z.number()            |
| decimal128     | z.number()            |

Example TypeSpec:

```tsp
model NumericTypes {
  numericProperty: numeric;
  integerProperty: integer;
  floatProperty: float;
  int64Property: int64;
  int32Property: int32;
  int16Property: int16;
  int8Property: int8;
  safeintProperty: safeint;
  uint64Property: uint64;
  uint32Property: uint32;
  uint16Property: uint16;
  uint8Property: uint8;
  float32Property: float32;
  float64Property: float64;
  decimalProperty: decimal;
  decimal128Property: decimal128;
}
```

Generated Zod schema:

```ts
export const schemaNumericTypes = z.object({
  numericProperty: z.number(),
  integerProperty: z.number(),
  floatProperty: z.number(),
  int64Property: z.number().int(),
  int32Property: z.number().int(),
  int16Property: z.number().int(),
  int8Property: z.number().int(),
  safeintProperty: z.number().int(),
  uint64Property: z.number().int(),
  uint32Property: z.number().int(),
  uint16Property: z.number().int(),
  uint8Property: z.number().int(),
  float32Property: z.number(),
  float64Property: z.number(),
  decimalProperty: z.number(),
  decimal128Property: z.number()
})
```

## Date and Time types

These types involve conversions that consider date and time formatting:

| TypeSpec Type  |  Zod Type Conversion  |
|----------------|-----------------------|
| plainDate      | z.string().date()     |
| plainTime      | z.string().time()     |
| utcDateTime    | z.string().datetime() |
| offsetDateTime | z.string().datetime() |
| duration       | z.string().duration   |

Example TypeSpec:

```tsp
model DateAndTimeTypes {
  plainDateProperty: plainDate;
  plainTimeProperty: plainTime;
  utcDateTimeProperty: utcDateTime;
  offsetDateTimeProperty: offsetDateTime;
  durationProperty: duration;
}
```

Generated Zod schema:

```ts
export const schemaDateAndTimeTypes = z.object({
  plainDateProperty: z.string().date(),
  plainTimeProperty: z.string().time(),
  utcDateTimeProperty: z.string().datetime(),
  offsetDateTimeProperty: z.string().datetime(),
  durationProperty: z.string().duration()
})
```

## Other core types

These are additional core types and their mappings:

| TypeSpec Type     |  Zod Type Conversion                           |
|-------------------|------------------------------------------------|
| bytes             | Not supported but it generated as z.string()   |
| string            | z.string()                                     |
| boolean           | z.boolean()                                    |
| null              | z.unknown()                                    |
| Array\<Element\>  | z.array(z.Element())                           |
| Record\<Element\> | Not supported but it generated as z.object({}) |
| unknown           | z.unknown()                                    |
| void              | NOT SUPPORTED                                  |
| never             | NOT SUPPORTED                                  |

Example TypeSpec:

```tsp
model OtherCoreTypes {
  bytesProperty: bytes;
  stringProperty: string;
  booleanProperty: boolean;
  nullProperty: null;
  ArrayProperty: numeric[];
  recordProperty: Record<numeric>;
  unknownProperty: unknown;
  // voidProperty: void; Not Supported
  // neverProperty: never; Not Supported
}
```

Generated Zod schema:

```ts
export const schemaOtherCoreTypes = z.object({
  bytesProperty: z.string(),
  stringProperty: z.string(),
  booleanProperty: z.boolean(),
  nullProperty: z.unknown(),
  ArrayProperty: z.array(z.number()),
  recordProperty: z.record(z.string(), z.number()),
  unknownProperty: z.unknown()
})
```

## String types

The tool also supports string-specific types and their conversions:

| TypeSpec Type  |  Zod Type Conversion |
|----------------|----------------------|
| url            | z.string().url()     |

Example TypeSpec:

```tsp
model StringTypes {
  urlProperty: url;
}
```

Generated Zod schema:

```ts
export const schemaStringTypes = z.object({
  urlProperty: z.string().url()
})
```

## Supported TypeSpec Decorators

These decorators in TypeSpec can be converted to specific constraints in Zod schemas:

| TypeSpec Decorator  | Zod Type Conversion |
|---------------------|---------------------|
| @minItems()         | .min()              |
| @maxItems()         | .max()              |
| @minLength()        | .min()              |
| @maxLength()        | .max()              |
| @minValue()         | .gte()              |
| @maxValue()         | .lte()              |
| @exclusiveMinimum() | .gt()               |
| @exclusiveMaximum() | .lt()               |

Example TypeSpec:

```tsp
model TypeSpecDecorators {
  @minItems(1)
  @maxItems(5)
  items: string[];

  @minLength(1)
  @maxLength(5)
  name: string;

  @minValue(1)
  @maxValue(5)
  age: int16;

  @minValueExclusive(1)
  @maxValueExclusive(5)
  count: int16;
}
```

Generated Zod schema:

```ts
export const schemaTypeSpecDecorators = z.object({
  items: z.array(z.string()).min(1).max(5),
  name: z.string().min(1).max(5),
  age: z.number().int().gte(1).lte(5),
  count: z.number().int().gt(1).lt(5)
})
```

## Supported TypeSpec Format Decorators

These format decorators in TypeSpec can be converted to specific constraints in Zod schemas:

| TypeSpec Format      | Zod Type Conversion |
|----------------------|---------------------|
| @format("date-time") | .datetime()         |
| @format("date")      | .date()             |
| @format("time")      | .time()             |
| @format("duration")  | .duration()         |
| @format("ip")        | .ip()               |
| @format("email")     | .email()            |
| @format("uuid")      | .uuid()             |
| @format("cuid")      | .cuid()             |
| @format("cuid2")     | .cuid2()            |
| @format("uri")       | .url()              |
| @format("url")       | .url()              |

## Extended Syntax for Doc Decorator

By using the `zod:` identifier within a doc comment, you can instruct the `otz` to generate Zod schemas with specific requirements.

This feature provides greater flexibility and control over the validation rules directly from the TypeSpec model.

Example TypeSpec:

```tsp
model ExtendedSyntaxForDocDecorator {
  @doc("Username zod: z.string().min(2, { message: 'Must be 2 or more characters long' })")
  name: string;
}
```

Generated Zod schema:

```ts
export const schemaExtendedSyntaxForDocDecorator = z.object({
  // Username
  name: z.string().min(2, { message: 'Must be 2 or more characters long' })
})
```
