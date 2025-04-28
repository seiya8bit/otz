import { describe, expect, it } from 'vitest'
import { CodeGenerator } from '../../src/codeGenerator.js'
import { FileManager } from '../../src/fileManager.js'
import { setGlobalOptions } from '../../src/globals.js'

describe('validate nullable option', () => {
  it('handle nullish mode', async () => {
    const fileManager = new FileManager('test/option/__snapshots__/openapi.yaml', 'dummy.ts')
    const openApiObject = await fileManager.load()

    let result: string = ''
    setGlobalOptions({ nullableMode: 'nullish' })
    const codeGenerator = new CodeGenerator(openApiObject, output => result = output, true, true, true)
    codeGenerator.generate()

    await expect(result).toMatchFileSnapshot('__snapshots__/nullish.ts')
  })

  it('handle optional mode', async () => {
    const fileManager = new FileManager('test/option/__snapshots__/openapi.yaml', 'dummy.ts')
    const openApiObject = await fileManager.load()

    let result: string = ''
    setGlobalOptions({ nullableMode: 'optional' })
    const codeGenerator = new CodeGenerator(openApiObject, output => result = output, true, true, true)
    codeGenerator.generate()

    await expect(result).toMatchFileSnapshot('__snapshots__/optional.ts')
  })
})
