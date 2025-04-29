import type { OpenAPIObject } from 'openapi3-ts/oas31'
import type ts from 'typescript'
import ast from './parser/ast.js'
import { ComponentParser } from './parser/componentParser.js'
import { PathParser } from './parser/pathParser.js'

export class CodeGenerator {
  private componentParser: ComponentParser
  private pathParser: PathParser

  constructor(
    private readonly openApiObject: OpenAPIObject,
    private readonly onWrite: (output: string) => void,
    private readonly generateComponents: boolean,
    private readonly generatePaths: boolean,
    private readonly generateQueries: boolean,
  ) {
    this.componentParser = new ComponentParser()
    this.pathParser = new PathParser()
    this.openApiObject = openApiObject
  }

  public generate() {
    const outputNodes: ts.Node[] = []

    // add import declaration
    outputNodes.push(ast.createZodImportAst())

    if (this.openApiObject.components && this.generateComponents) {
      const nodes = this.componentParser.toAst(this.openApiObject.components)
      outputNodes.push(...nodes)
    }
    if (this.openApiObject.paths && this.generatePaths) {
      const nodes = this.pathParser.toAstPath(this.openApiObject.paths)
      outputNodes.push(...nodes)
    }
    if (this.openApiObject.paths && this.generateQueries) {
      const nodes = this.pathParser.toAstQuey(this.openApiObject.paths)
      outputNodes.push(...nodes)
    }

    this.onWrite(ast.printAst(outputNodes))
  }
}
