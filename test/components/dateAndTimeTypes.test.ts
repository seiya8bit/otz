import { describe, expect, it } from 'vitest'
import { CodeGenerator } from '../../src/codeGenerator.js'
import { FileManager } from '../../src/fileManager.js'

describe('date and time types code generation', () => {
  it('generates zod schema for date and time types', async () => {
    const fileManager = new FileManager('test/components/__snapshots__/dateAndTimeTypes.yaml', 'dummy.ts')
    const openApiObject = await fileManager.load()

    let result: string = ''
    const generator = new CodeGenerator(openApiObject, output => result = output, true, true, true)
    generator.generate()

    await expect(result).toMatchFileSnapshot('__snapshots__/dateAndTimeTypes.ts')
  })
})
