import type { OperationObject, PathsObject, SchemaObject } from 'openapi3-ts/oas31'
import type { Node } from 'typescript'
import camelCase from 'camelcase'
import consola from 'consola'
import c from '../constants.js'
import ast from './ast.js'

export class PathParser {
  private methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']

  private toSchemas(operationObject: OperationObject, inType: 'path' | 'query') {
    const parameters = operationObject.parameters ?? []
    const schema: SchemaObject = { type: 'object', properties: {}, required: [] }

    for (const parameter of parameters) {
      if (!ast.isParameterObject(parameter)) {
        consola.warn('[PathParser]: ReferenceObject is not supported.', parameter.$ref)
        continue
      }
      if (parameter.schema && parameter.in === inType) {
        schema.properties![parameter.name] = parameter.schema
        if (parameter.required) {
          schema.required!.push(parameter.name)
        }
      }
    }

    return Object.entries(schema.properties ?? {}).length > 0
      ? schema
      : undefined
  }

  public toAstPath(pathsObject: PathsObject) {
    const nodes: Node[] = []

    for (const [_path, pathItemObject] of Object.entries(pathsObject)) {
      for (const method of this.methods) {
        const key = method as keyof typeof pathItemObject
        const operationObject: OperationObject | undefined = pathItemObject[key]
        if (!operationObject) {
          continue
        }
        const operationId = ast.toValidIdentifier(operationObject.operationId ?? '')
        const schema = this.toSchemas(operationObject, 'path')
        if (schema) {
          const statement = ast.createZodVariableStatement(
            camelCase(`${c.PATH_PREFIX}_${operationId}`),
            schema,
          )
          nodes.push(statement)
        }
      }
    }
    return nodes
  }

  public toAstQuey(pathsObject: PathsObject) {
    const nodes: Node[] = []

    for (const [_path, pathItemObject] of Object.entries(pathsObject)) {
      for (const method of this.methods) {
        const key = method as keyof typeof pathItemObject
        const operationObject: OperationObject | undefined = pathItemObject[key]
        if (!operationObject) {
          continue
        }
        const operationId = ast.toValidIdentifier(operationObject.operationId ?? '')
        const schema = this.toSchemas(operationObject, 'query')
        if (schema) {
          const statement = ast.createZodVariableStatement(
            camelCase(`${c.QUERY_PREFIX}_${operationId}`),
            schema,
          )
          nodes.push(statement)
        }
      }
    }
    return nodes
  }
}
