import { describe, expect, it } from 'vitest'
import { CodeGenerator } from '../../src/codeGenerator.js'
import { FileManager } from '../../src/fileManager.js'

describe('petstore api schema generation', () => {
  it('should generate matching zod schema from petstore openapi spec', async () => {
    const fileManager = new FileManager('test/spec/__snapshots__/petstore.yaml', 'dummy.ts')
    const openApiObject = await fileManager.load()

    let result: string = ''
    const codeGenerator = new CodeGenerator(openApiObject, output => result = output, true, true, true)
    codeGenerator.generate()

    await expect(result).toMatchFileSnapshot('__snapshots__/petstore.ts')
  })
})
