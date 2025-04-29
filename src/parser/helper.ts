/**
 * Checks if a string represents a BigInt literal (e.g., '10n', '-5n')
 * and returns the corresponding BigInt value if it does, otherwise returns undefined.
 *
 * @param input - The string to check.
 * @returns The BigInt value or undefined.
 */
function parseBigInt(input: string): bigint | undefined {
  if (typeof input !== 'string' || !input.endsWith('n')) {
    return undefined
  }

  const numericPart = input.slice(0, -1)

  if (numericPart === '' || numericPart === '-') {
    return undefined
  }

  try {
    return BigInt(numericPart)
  }
  catch {
    return undefined
  }
}

export default {
  parseBigInt,
}
