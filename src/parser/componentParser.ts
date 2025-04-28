import type { ComponentsObject } from 'openapi3-ts/oas31'
import type { Node } from 'typescript'
import camelCase from 'camelcase'
import c from '../constants.js'
import ast from './ast.js'

export class ComponentParser {
  public toAst(componentsObject: ComponentsObject) {
    const nodes: Node[] = []

    if (componentsObject.schemas) {
      for (const [name, schema] of Object.entries(componentsObject.schemas)) {
        const variableName = camelCase(`${c.SCHEMA_PREFIX}_${name}`)
        const statement = ast.createZodVariableStatement(variableName, schema)
        nodes.push(statement)
      }
    }

    return nodes
  }
}
