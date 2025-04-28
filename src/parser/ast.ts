import type { ComponentsObject, OpenAPIObject, ParameterObject, ReferenceObject, SchemaObject } from 'openapi3-ts/oas31'
import type { CallExpression, Identifier, Node, ObjectLiteralElementLike } from 'typescript'
import { EOL } from 'node:os'
import camelCase from 'camelcase'
import consola from 'consola'
import { isReferenceObject, isSchemaObject } from 'openapi3-ts/oas31'
import * as ts from 'typescript'
import c from '../constants.js'
import { getGlobalOptions } from '../globals.js'

/**
 * Converts a string into a valid TypeScript identifier.
 *
 * @param str - The string to convert into a valid identifier.
 * @returns A valid TypeScript identifier.
 *
 * @example
 * ```ts
 * toValidIdentifier('123abc') // Returns '_123abc'
 * toValidIdentifier('hello-world') // Returns 'hello_world'
 * toValidIdentifier('class') // Returns '_class' (reserved keyword)
 * toValidIdentifier('') // Returns '_'
 * ```
 *
 * @remarks
 * This function performs the following transformations:
 * - Replaces invalid starting characters with '_'
 * - Converts invalid characters to '_'
 * - Prefixes reserved TypeScript keywords with '_'
 * - Returns '_' for empty strings
 *
 * Valid identifiers must:
 * - Start with a letter, underscore (_), or dollar sign ($)
 * - Contain only letters, numbers, underscores, or dollar signs
 * - Not be a reserved TypeScript keyword
 */
function toValidIdentifier(str: string) {
  if (!str) {
    return '_'
  }
  let result = str.replace(/^[^a-z_$]/i, match => /\d/.test(match) ? `_${match}` : '_')
  result = result.replace(/[^\w$]/g, '_')

  if (c.TS_RESERVED_KEYWORDS.includes(result)) {
    result = `_${result}`
  }
  return result
}

/**
 * Extracts the schema name from a reference string ($ref).
 *
 * @param $ref - The reference string in the format "#/components/schemas/SchemaName".
 * @returns The schema name extracted from the reference path. Returns an empty string if the path is invalid.
 *
 * @example
 * ```ts
 * const ref = "#/components/schemas/User"
 * getSchemaNameFromRef(ref) // Returns "User"
 * ```
 *
 * @remarks
 * This function expects references to follow the OpenAPI convention of using "#/components/schemas/"
 * as the base path. If the reference doesn't follow this convention, a warning will be logged.
 */
function getSchemaNameFromRef($ref: string) {
  if (!$ref.startsWith('#/components/schemas')) {
    consola.warn('$ref does not start with the expected path `#/components/schemas`.')
  }
  return $ref.split('/').pop() ?? ''
}

/**
 * Creates an import declaration for the zod library.
 *
 * @returns A TypeScript import declaration for zod.
 *
 * @example
 * ```ts
 * import { z } from "zod"
 * ```
 */
function createZodImportAst() {
  return ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(
      false,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier('z')),
      ]),
    ),
    ts.factory.createStringLiteral('zod'),
    undefined,
  )
}

/**
 * Represents the supported Zod types, including primitive types and other supported types.
 *
 * @see https://zod.dev/?id=primitives
 */
type ZodType =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'date'
  | 'symbol'
  | 'undefined'
  | 'null'
  | 'void'
  | 'any'
  | 'unknown'
  | 'never'
  | 'array'
  | 'enum'
  | 'object'
  | 'union'
  | 'record'

/**
 * Creates a TypeScript property access expression for a specified zod type.
 *
 * @param type - The zod type as a string, which can be 'unknown', 'enum', 'union',
 * 'array', 'object', 'number', or any other valid zod type.
 * @returns A PropertyAccessExpression representing the zod type.
 *
 * @example
 * ```ts
 * createZodPropertyAccessAst('string')
 * // z.string()
 *
 * createZodPropertyAccessAst('array')
 * // z.array()
 * ```
 */
function createZodPropertyAccessAst(type: ZodType) {
  return ts.factory.createPropertyAccessExpression(
    ts.factory.createIdentifier('z'),
    ts.factory.createIdentifier(type),
  )
}

/**
 * Creates a zod expression based on a given OpenAPI schema object.
 *
 * @param object - The schema object or reference object.
 * @param required - Indicates if the property is required (default is true).
 * @returns A CallExpression or Identifier representing the zod schema.
 *
 * @example
 * ```ts
 * z.string().email().default('user@example.com')
 * z.object({
 *   propA: z.string(),
 *   propB: z.number(),
 * })
 * ```
 */
function createZodSchemaAst(
  object: SchemaObject | ReferenceObject,
  required: boolean = true,
): CallExpression | Identifier {
  if (isReferenceObject(object)) {
    const name = getSchemaNameFromRef(object.$ref)
    return ts.factory.createIdentifier(camelCase(`${c.SCHEMA_PREFIX}_${name}`))
  }

  const createBaseExpression = () => {
    // Enum type
    if (object.enum) {
      return ts.factory.createCallExpression(
        createZodPropertyAccessAst('enum'),
        undefined,
        [ts.factory.createArrayLiteralExpression(
          object.enum.map(e => ts.factory.createStringLiteral(String(e))),
          false,
        )],
      )
    }

    // TODO: Support record type
    // // Record type
    // if (object.additionalProperties !== undefined) {
    //   const additionalProperties = typeof object.additionalProperties === 'boolean'
    //     ? createZodPropertyAccessAst('boolean')
    //     : createZodSchemaAst(object.additionalProperties)

    //   return ts.factory.createCallExpression(
    //     createZodPropertyAccessAst('record'),
    //     undefined,
    //     [
    //       ts.factory.createCallExpression(
    //         createZodPropertyAccessAst('string'),
    //         undefined,
    //         [],
    //       ),
    //       additionalProperties,
    //     ],
    //   )
    // }

    // Union type
    if (object.anyOf || object.oneOf) {
      const target = [...object?.anyOf ?? [], ...object?.oneOf ?? []]
      const unionTypes = target.map(object => createZodSchemaAst(object))

      return ts.factory.createCallExpression(
        createZodPropertyAccessAst('union'),
        undefined,
        [ts.factory.createArrayLiteralExpression(unionTypes, false)],
      )
    }
    // Extended notation for description
    if (isDocExtendedNotation(object.description)) {
      const schemaExpression = extractZodSchemaFromDescription(object.description)
      return ts.factory.createIdentifier(schemaExpression)
    }

    switch (object.type) {
      case 'array':
        return ts.factory.createCallExpression(
          createZodPropertyAccessAst('array'),
          undefined,
          [object.items ? createZodSchemaAst(object.items) : createZodPropertyAccessAst('unknown')],
        )
      case 'object':
      {
        const properties = object.properties
          ? Object.entries(object.properties).map(([name, child]) => {
            const required = object.required?.includes(name) ?? false
            return createZodPropertyAssignmentAst(name, child, required)
          },
          )
          : []
        return ts.factory.createCallExpression(
          createZodPropertyAccessAst('object'),
          undefined,
          [ts.factory.createObjectLiteralExpression(properties, true)],
        )
      }
      case 'integer':
      case 'number':
        return ts.factory.createCallExpression(
          createZodPropertyAccessAst('number'),
          undefined,
          [],
        )
      case 'boolean':
      case 'null':
      case 'string':
        return ts.factory.createCallExpression(
          createZodPropertyAccessAst(object.type),
          undefined,
          [],
        )
      default:
        return ts.factory.createCallExpression(
          createZodPropertyAccessAst('unknown'),
          undefined,
          [],
        )
    }
  }

  let expression = createBaseExpression()
  if (ts.isCallExpression(expression)) {
    expression = applyMergeToZodExpression(object, expression)
    expression = applyFormatToZodExpression(object, expression)
    expression = applyConstraintsToZodExpression(object, expression)
    expression = applyNullableToZodExpression(required, expression)
    expression = applyDefaultToZodExpression(object, expression)
  }

  return expression
}

/**
 * Generates a zod property assignment for a given property name and schema.
 *
 * @param identifier - The name of the property.
 * @param object - The schema object or reference.
 * @param required - If true, the property is required; otherwise, it's optional.
 * @returns A simplified PropertyAssignment for zod schema generation.
 *
 * @example
 * ```ts
 * a: z.string(),
 * b: z.number()
 * ```
 */
function createZodPropertyAssignmentAst(
  identifier: string,
  object: SchemaObject | ReferenceObject,
  required: boolean = true,
) {
  // Creates the property name for the AST node, either as an Identifier if it's a valid JavaScript
  // identifier (starts with a letter, underscore, or $ and contains only letters, numbers, underscores, or $),
  // or as a StringLiteral if it contains special characters
  const propertyName = /^[a-z_$][\w$]*$/i.test(identifier)
    ? ts.factory.createIdentifier(identifier)
    : ts.factory.createStringLiteral(identifier)

  const assignment = ts.factory.createPropertyAssignment(
    propertyName,
    createZodSchemaAst(object, required),
  )
  const description = removeZodSchemaFromDescription(object.description)

  return applyComment(description, 'single', assignment)
}

/**
 * Creates a variable statement exporting a zod schema.
 *
 * @param variableName - The name of the variable.
 * @param object - The schema object or reference object.
 * @returns A variable statement declaring the zod schema.
 *
 * @example
 * ```ts
 * export const mySchema = z.object({
 *   a: z.string(),
 *   b: z.number(),
 * })
 * ```
 */
function createZodVariableStatement(variableName: string, object: SchemaObject | ReferenceObject) {
  const statement = ts.factory.createVariableStatement(
    [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [ts.factory.createVariableDeclaration(
        ts.factory.createIdentifier(variableName),
        undefined,
        undefined,
        createZodSchemaAst(object),
      )],
      ts.NodeFlags.Const,
    ),
  )
  const description = removeZodSchemaFromDescription(object.description)

  return applyComment(description, 'single', statement)
}

/**
 * Adds a format specification to a zod call expression.
 *
 * @param object - The schema object or reference object.
 * @param callExpression - The existing call expression.
 * @returns A new CallExpression with the format applied.
 */
function applyFormatToZodExpression(object: SchemaObject, callExpression: CallExpression) {
  const format = object.format
  if (!format) {
    return callExpression
  }

  const formatMap: { [key: string]: string } = {
    'integer': 'int',
    'int64': 'int',
    'int32': 'int',
    'int16': 'int',
    'int8': 'int',
    'safeint': 'int',
    'uint64': 'int',
    'uint32': 'int',
    'uint16': 'int',
    'uint8': 'int',
    'date-time': 'datetime',
    'date': 'date',
    'time': 'time',
    'duration': 'duration',
    'ip': 'ip',
    'email': 'email',
    'uuid': 'uuid',
    'cuid': 'cuid',
    'cuid2': 'cuid2',
    'url': 'url',
    'uri': 'url',
  }

  const formatIdentifier = formatMap[format]
  if (!formatIdentifier) {
    return callExpression
  }

  return ts.factory.createCallExpression(
    ts.factory.createPropertyAccessExpression(
      callExpression,
      ts.factory.createIdentifier(formatIdentifier),
    ),
    undefined,
    [],
  )
}

/**
 * Adds a default value to a zod call expression.
 *
 * @param object - The schema object or reference object.
 * @param callExpression - The existing call expression.
 * @returns A new CallExpression with the default value applied.
 */
function applyDefaultToZodExpression(object: SchemaObject, callExpression: CallExpression) {
  const defaultValue = object.default
  if (defaultValue === undefined) {
    return callExpression
  }

  const toLiteral = (v: any) => {
    const type = typeof v
    switch (type) {
      case 'string':
        return ts.factory.createStringLiteral(v)
      case 'number':
        return ts.factory.createNumericLiteral(v)
      case 'bigint':
        return ts.factory.createBigIntLiteral(v)
      case 'boolean':
        return v ? ts.factory.createTrue() : ts.factory.createFalse()
      case 'object': {
        const properties: ObjectLiteralElementLike[] = Object.keys(v).map((key) => {
          return ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier(key),
            toLiteral(v[key]),
          )
        })
        return ts.factory.createObjectLiteralExpression(properties, true)
      }
      default:
        return ts.factory.createNull()
    }
  }

  const argumentNode = Array.isArray(defaultValue)
    ? ts.factory.createArrayLiteralExpression(defaultValue.map(v => toLiteral(v)))
    : toLiteral(defaultValue)

  return ts.factory.createCallExpression(
    ts.factory.createPropertyAccessExpression(
      callExpression,
      ts.factory.createIdentifier('default'),
    ),
    undefined,
    [argumentNode],
  )
}

/**
 * Marks a zod call expression as nullish or optional.
 *
 * @param required - If false, adds a nullish modifier to the zod type.
 * @param callExpression - The current call expression.
 * @returns The modified CallExpression.
 */
function applyNullableToZodExpression(required: boolean, callExpression: CallExpression) {
  if (required) {
    return callExpression
  }
  const identifier = getGlobalOptions().nullableMode

  return ts.factory.createCallExpression(
    ts.factory.createPropertyAccessExpression(
      callExpression,
      ts.factory.createIdentifier(identifier),
    ),
    undefined,
    [],
  )
}

/**
 * Adds constraints such as min, max, greater than, and less than to a zod call expression.
 *
 * @param object - An object containing the constraint values.
 * @param callExpression - The existing call expression.
 * @returns A new CallExpression with the constraints applied.
 */
function applyConstraintsToZodExpression(object: SchemaObject, callExpression: CallExpression) {
  const constraints = [
    { prop: 'minItems', method: 'min' },
    { prop: 'maxItems', method: 'max' },
    { prop: 'minLength', method: 'min' },
    { prop: 'maxLength', method: 'max' },
    { prop: 'minimum', method: object.exclusiveMinimum ? 'gt' : 'gte' },
    { prop: 'maximum', method: object.exclusiveMaximum ? 'lt' : 'lte' },
  ]

  let currentExpression = callExpression
  for (const { prop, method } of constraints) {
    if ((object as any)[prop] !== undefined) {
      currentExpression = ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          currentExpression,
          ts.factory.createIdentifier(method),
        ),
        undefined,
        [ts.factory.createNumericLiteral((object as any)[prop])],
      )
    }
  }

  return currentExpression
}

/**
 * Merges additional schemas into a given Zod call expression using the `merge` method.
 *
 * @param object - The OpenAPI schema object which may contain an `allOf` array.
 * @param callExpression - The existing Zod call expression that may be merged with additional schemas.
 * @returns A new CallExpression representing the result of merging the provided schemas.
 */
function applyMergeToZodExpression(object: SchemaObject, callExpression: CallExpression) {
  const allOf = object.allOf
  if (!allOf?.length) {
    return callExpression
  }

  let mergedExpression: CallExpression | Identifier = callExpression
  for (const schema of allOf) {
    const schemaExpression = createZodSchemaAst(schema)

    if (isObjectExpression(callExpression)) {
      mergedExpression = ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          mergedExpression,
          ts.factory.createIdentifier('merge'),
        ),
        undefined,
        [schemaExpression],
      )
    }
    else {
      mergedExpression = schemaExpression
    }
  }

  return mergedExpression as CallExpression
}

/**
 * Applies a comment to a given TypeScript AST node.
 *
 * @template T - The type of the AST node, extending from the base Node type.
 * @param comment - The comment text to be added. If undefined, no comment is added.
 * @param line - Specifies the type of comment: 'single' for single-line or 'multiple' for multi-line.
 * @param node - The TypeScript AST node to which the comment will be applied.
 * @returns The modified AST node with the comment applied.
 */
function applyComment<T extends Node>(comment: string, line: 'single' | 'multiple', node: T) {
  if (!comment) {
    return node
  }
  const kind = line === 'single'
    ? ts.SyntaxKind.SingleLineCommentTrivia
    : ts.SyntaxKind.MultiLineCommentTrivia

  const text = line === 'single'
    ? ` ${comment.replace(/\r?\n|\r/g, '')}`
    : ` ${comment.replace(/\*\//g, '*\\/')}`

  return ts.addSyntheticLeadingComment(node, kind, text, true)
}

/**
 * Checks if a schema object or any of its children contain a ReferenceObject.
 *
 * @param object - The schema object to check for references.
 * @returns A boolean indicating if there is a reference object.
 */
function hasReferenceObject(object: SchemaObject) {
  const targets: Record<string, (SchemaObject | ReferenceObject)[]> = {
    allOf: object.allOf ?? [],
    anyOf: object.anyOf ?? [],
    oneOf: object.oneOf ?? [],
    items: object.items ? [object.items] : [],
    properties: object.properties ? [...Object.values(object.properties)] : [],
    additionalProperties: object.additionalProperties
      ? typeof object.additionalProperties !== 'boolean' ? [object.additionalProperties] : []
      : [],
    // TODO: check if `not` in SchemaObject is ReferenceObject
    // TODO: check if `propertyNames` in SchemaObject is ReferenceObject
  }

  for (const [_, values] of Object.entries(targets)) {
    for (const value of values) {
      if (isReferenceObject(value)) {
        return true
      }
    }
  }
  return false
}

/**
 * Converts a schema object or a reference object to a pure schema object,
 * resolving any references recursively.
 *
 * @param componentsObject - The full OpenAPI components object containing all schemas.
 * @param object - The schema or reference object to convert.
 * @returns The resolved schema object.
 * @throws If a schema referenced is not found or is itself a reference.
 */
function convertReferenceToSchema(
  componentsObject: ComponentsObject,
  object: SchemaObject | ReferenceObject,
) {
  // The object does not contain any ReferenceObject.
  if (isSchemaObject(object) && !hasReferenceObject(object)) {
    return object
  }
  if (isReferenceObject(object)) {
    const name = getSchemaNameFromRef(object.$ref)
    const schema = componentsObject?.schemas?.[name]
    if (!schema) {
      throw new Error(`Schema for reference ${object.$ref} not found.`)
    }
    return convertReferenceToSchema(componentsObject, schema)
  }
  else {
    // The SchemaObject contains one or more ReferenceObjects.
    const newObject = Object.assign({}, object)
    newObject.allOf = newObject.allOf?.map(o => convertReferenceToSchema(componentsObject, o))
    newObject.anyOf = newObject.anyOf?.map(o => convertReferenceToSchema(componentsObject, o))
    newObject.oneOf = newObject.oneOf?.map(o => convertReferenceToSchema(componentsObject, o))
    newObject.items = newObject.items ? convertReferenceToSchema(componentsObject, newObject.items) : undefined
    newObject.additionalProperties = newObject.additionalProperties && typeof newObject.additionalProperties !== 'boolean'
      ? convertReferenceToSchema(componentsObject, newObject.additionalProperties)
      : undefined
    const newProperties = newObject.properties ?? {}
    for (const name in newObject.properties) {
      newProperties[name] = convertReferenceToSchema(componentsObject, newObject.properties[name])
    }
    newObject.properties = newProperties

    // TODO: newObject.not
    // TODO: newObject.propertyNames

    return newObject
  }
}

/**
 * Resolves all schema references within the OpenAPI object,
 * replacing each $ref with the pure schema object.
 *
 * @returns A new OpenAPIObject with resolved schema references.
 */
function resolveSchemaReferences(openApiObject: OpenAPIObject) {
  const result = { ...openApiObject }

  if (result.components?.schemas) {
    for (const name in result.components.schemas) {
      const schema = result.components.schemas[name]
      result.components.schemas[name] = convertReferenceToSchema(openApiObject, schema)
    }
  }

  return result
}

/**
 * Determines if a given CallExpression represents an object creation.
 *
 * This function checks if the call expression corresponds to property access
 * with the name 'object', indicating the use of an 'object' expression.
 *
 * @param callExpression - The CallExpression to evaluate.
 * @returns True if the CallExpression is an object expression; otherwise, false.
 */
function isObjectExpression(callExpression: CallExpression) {
  const kind = callExpression.expression.kind
  const text = (callExpression.expression as any)?.name?.text
  return kind === ts.SyntaxKind.PropertyAccessExpression && text === 'object'
}

/**
 * Checks if a description contains an doc extended notation.
 * The extended notation is recognized if it contains 'zod:' followed by the schema definition.
 *
 * @param description - The description string to check.
 * @returns True if the description contains extended zod notation; otherwise, false.
 */
function isDocExtendedNotation(description: string | undefined) {
  if (!description) {
    return false
  }
  return description.split('zod: ').length >= 2
}

/**
 * Type guard to determine if an object is a ParameterObject.
 *
 * This function checks if the provided object is a ParameterObject
 * rather than a ReferenceObject. It does this by checking if the
 * object is not a ReferenceObject.
 *
 * @param object - The object to check, which can be either a ReferenceObject or a ParameterObject.
 * @returns True if the object is a ParameterObject; otherwise, false.
 */
function isParameterObject(object: ReferenceObject | ParameterObject): object is ParameterObject {
  return !isReferenceObject(object)
}

/**
 * Extracts the Zod schema portion from a documentation's extended notation.
 * The extended notation is recognized if it contains 'zod:' followed by the schema definition.
 *
 * @param description - The description string containing the Zod extended notation.
 * @returns The extracted Zod schema as a string if available; otherwise, an empty string.
 *
 * @example
 * ```ts
 * const description = "This is an example description. zod: string().min(1)"
 * const extracted = extractZodSchemaFromDescription(description)
 * // -> "string().min(1)"
 * ```
 */
function extractZodSchemaFromDescription(description: string | undefined) {
  const parts = description?.split('zod: ') ?? ''
  return parts.length < 2 ? '' : parts[1].trim()
}

/**
 * Removes the Zod schema from the description and returns the remaining string.
 *
 * @param description - The description string containing the Zod extended notation.
 * @returns The description without the Zod schema portion.
 *
 * @example
 * ```ts
 * const description = "This is an example description. zod: string().min(1)"
 * const result = removeZodSchemaFromDescription(description)
 * // -> "This is an example description."
 * ```
 */
function removeZodSchemaFromDescription(description: string | undefined) {
  return description?.split('zod: ')[0].trim() ?? ''
}

/**
 * Prints an array of TypeScript AST nodes as strings.
 *
 * @param ast - An array of TypeScript AST nodes to be printed.
 * @returns A string representation of the given AST nodes.
 */
function printAst(ast: Node[]) {
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  const file = ts.createSourceFile('', '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS)
  const result = ast.map(node => printer.printNode(ts.EmitHint.Unspecified, node, file))
  return result.join(EOL + EOL)
}

export default {
  toValidIdentifier,
  getSchemaNameFromRef,
  createZodImportAst,
  createZodPropertyAccessAst,
  createZodSchemaAst,
  createZodPropertyAssignmentAst,
  createZodVariableStatement,
  applyFormatToZodExpression,
  applyDefaultToZodExpression,
  applyNullableToZodExpression,
  applyConstraintsToZodExpression,
  applyMergeToZodExpression,
  applyComment,
  hasReferenceObject,
  convertReferenceToSchema,
  resolveSchemaReferences,
  isObjectExpression,
  isDocExtendedNotation,
  isParameterObject,
  extractZodSchemaFromDescription,
  removeZodSchemaFromDescription,
  printAst,
}
