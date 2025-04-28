#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import packageJson from '../package.json'
import { CodeGenerator } from './codeGenerator.js'
import { FileManager } from './fileManager.js'
import { setGlobalOptions } from './globals.js'

const main = defineCommand({
  meta: {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
  },
  args: {
    'input': {
      type: 'string',
      alias: ['i'],
      description: 'Input .yaml path',
      required: true,
    },
    'output': {
      type: 'string',
      alias: ['o'],
      description: 'Output .ts path',
      required: true,
    },
    'components': {
      type: 'boolean',
      alias: ['c'],
      description: 'Generate components',
      required: false,
      default: false,
    },
    'paths': {
      type: 'boolean',
      alias: ['p'],
      description: 'Generate paths',
      required: false,
      default: false,
    },
    'queries': {
      type: 'boolean',
      alias: ['q'],
      description: 'Generate queries',
      required: false,
      default: false,
    },
    'nullable-mode': {
      type: 'string',
      alias: ['n'],
      description: '',
      required: false,
      default: 'optional',
    },
  },
  run: async ({ args }) => {
    const fileManager = new FileManager(args.input, args.output)
    const openApiObject = await fileManager.load()

    setGlobalOptions({ nullableMode: args.nullableMode as 'nullish' | 'optional' })

    const codeGenerator = new CodeGenerator(
      openApiObject,
      output => fileManager.write(output),
      args.components,
      args.paths,
      args.queries,
    )
    codeGenerator.generate()
  },
})

runMain(main)
