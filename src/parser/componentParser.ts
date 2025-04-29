import type { ComponentsObject, ReferenceObject, SchemaObject } from 'openapi3-ts/oas31'
import type { Node } from 'typescript'
import camelCase from 'camelcase'
import consola from 'consola'
import { Graph, topologicalSort } from 'graph-data-structure'

import { isReferenceObject, isSchemaObject } from 'openapi3-ts/oas31'
import c from '../constants.js'
import ast from './ast.js'

export class ComponentParser {
  private graph = new Graph()

  public toAst(components: ComponentsObject, sortedSchemaKeys: string[]) {
    const nodes: Node[] = []

    const schemas = components.schemas
    // const schemaKeys = schemas ? Object.keys(schemas) : []
    const schemaKeys = sortedSchemaKeys

    if (components.schemas) {
      for (const key of schemaKeys) {
        const schema = schemas?.[key]
        if (!schema) {
          continue
        }

        const variableName = camelCase(`${c.SCHEMA_PREFIX}_${key}`)
        const statement = ast.createZodVariableStatement(variableName, schema)
        nodes.push(statement)
      }
    }

    return nodes
  }

  public sortByDependencies(components: ComponentsObject) {
    const traverse = (parentName: string, child: SchemaObject | ReferenceObject) => {
      if (isReferenceObject(child)) {
        const childName = ast.getSchemaNameFromRef(child.$ref)
        if (parentName !== childName) {
          this.graph.addEdge(parentName, childName)
        }
      }
    }

    if (components.schemas) {
      // Add Root nodes
      for (const [name, schema] of Object.entries(components.schemas)) {
        if (isSchemaObject(schema)) {
          this.graph.addNode(name)
        }
      }
      // Add child nodes
      for (const [name, schema] of Object.entries(components.schemas)) {
        if (isSchemaObject(schema)) {
          const children = this.getChildrenOfSchemaObject(schema)
          for (const child of children) {
            traverse(name, child)
          }
        }
      }
    }

    return topologicalSort(this.graph).reverse()
  }

  private getChildrenOfSchemaObject(object: SchemaObject) {
    const allOf = object.allOf ?? []
    const anyOf = object.anyOf ?? []
    const oneOf = object.oneOf ?? []
    const items = object.items ? [object.items] : []

    const properties = object.properties
      ? [...Object.values(object.properties)]
      : []

    const additionalProperties = object.additionalProperties
      ? typeof object.additionalProperties !== 'boolean'
        ? [object.additionalProperties]
        : []
      : []

    return [
      ...allOf,
      ...anyOf,
      ...oneOf,
      ...items,
      ...properties,
      ...additionalProperties,
    ]
  }
}
