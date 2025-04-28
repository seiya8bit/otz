# Supported Data Types

## `type: number`

| Supported format | Generated Zod schema |
| ---------------- | -------------------- |
| int8             | z.number().int()     |
| int16            | z.number().int()     |
| int32            | z.number().int()     |
| int64            | z.number().int()     |
| uint8            | z.number().int()     |
| uint16           | z.number().int()     |
| uint32           | z.number().int()     |
| uint64           | z.number().int()     |

| Keywords               | Generated Zod schemas |
| ---------------------- | --------------------- |
| minimum: x             | z.number().gte(x)     |
| maximum: x             | z.number().lte(x)     |
| exclusiveMinimum: true | z.number().gt(x)      |
| exclusiveMaximum: true | z.number().lt(x)      |

### Example

```yaml
components:
  schemas:
    GenericNumber:
      type: number
    FloatNumber:
      type: number
      format: float
    Int32Integer:
      type: integer
      format: int32
    Int64Integer:
      type: integer
      format: int64
      minimum: 2
      maximum: 5
      exclusiveMinimum: true
      exclusiveMaximum: true
```

```ts
export const schemaGenericNumber = z.number()
export const schemaFloatNumber = z.number()
export const schemaInt32Integer = z.number().int()
export const schemaInt64Integer = z.number().int().gt(2).lt(5)
```

## `type: string`

| Supported format | Generated Zod schema  |
| ---------------- | --------------------- |
| date             | z.string().date()     |
| date-time        | z.string().datetime() |
| duration         | z.string().duration() |
| email            | z.string().email()    |
| uuid             | z.string().uuid()     |
| cuid             | z.string().cuid()     |
| cuid2            | z.string().cuid2()    |
| uri              | z.string().url()      |
| url              | z.number().url()      |

| Keywords     | Generated Zod schemas   |
| ------------ | ----------------------- |
| minLength: x | z.string().min(x)       |
| maxLength: x | z.string().max(x)       |
| pattern: x   | Currently not supported |

### Example

```yaml
components:
  schemas:
    GenericString:
      type: string
      minLength: 2
      maxLength: 5
    DateTimeString:
      type: string
      format: date-time
    EmailString:
      type: string
      format: email
    CuidString:
      type: string
      format: cuid
```

```ts
export const schemaGenericString = z.string().min(2).max(5)
export const schemaDateTimeString = z.string().datetime()
export const schemaEmailString = z.string().email()
export const schemaCuidString = z.string().cuid()
```

## `type: boolean`

### Example

```yaml
components:
  schemas:
    Boolean:
      type: boolean
```

```ts
export const schemaBoolean = z.boolean()
```

## `type: array`

| Keywords     | Generated Zod schemas   |
| ------------ | ----------------------- |
| minItems: x | z.array().min(x)       |
| maxItems: x | z.array().max(x)       |

```yaml
components:
  schemas:
    Array:
      type: array
      items:
        type: string
```

```ts
export const schemaArray = z.array(z.string())
```

## `type: object`

| Keywords     | Generated Zod schemas   |
| ------------ | ----------------------- |
| minLength: x | z.string().min(x)       |
| maxLength: x | z.string().max(x)       |
| pattern: x   | Currently not supported |

```yaml
components:
  schemas:
    Object:
      type: object
      properties:
        id:
          type: integer
        username:
          type: string
        name:
          type: string
      required:
        - id
        - username
```

```ts
export const schemaObject = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string().optional()
})
```

<details>
<summary>It also supports nested objects.</summary>

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        contact_info:
          type: object
          properties:
            email:
              type: string
              format: email
            phone:
              type: string
```

```ts
export const schemaUser = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  contact_info: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional()
  }).optional()
})
```
</details>

# Custom validation using description keyword

You can override the default validation by embedding Zod rules directly into the `description` field of a property. Prefix the rule with `zod:`.

## Example

```yaml
components:
  schemas:
    StringTypes:
      type: object
      required:
        - CustomValidationString
      properties:
        CustomValidationString:
          type: string
          minLength: 4
          description: 'Custom validation zod: z.string().min(1, { message: "Required." })'
```

```ts
export const schemaStringTypes = z.object({
  // Custom validation
  CustomValidationString: z.string().min(1, { message: 'Required.' })
})
```
