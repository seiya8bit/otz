/**
 * Determines if a string represents a valid JavaScript BigInt literal.
 *
 * @param input - The string to check for BigInt literal format
 * @returns `true` if the string is a valid BigInt literal (ends with 'n' and can be parsed as a BigInt), `false` otherwise
 *
 * @example
 * ```ts
 * isBigIntLiteral("123n") // Returns true
 * isBigIntLiteral("0n")   // Returns true
 * isBigIntLiteral("-5n")  // Returns true
 * isBigIntLiteral("123")  // Returns false (no 'n' suffix)
 * isBigIntLiteral("n")    // Returns false (no numeric part)
 * isBigIntLiteral("-n")   // Returns false (invalid numeric part)
 * isBigIntLiteral("abc")  // Returns false (not a number)
 * ```
 *
 * @remarks
 * A valid BigInt literal in JavaScript must:
 * - End with the 'n' character
 * - Have a valid numeric part that can be converted to a BigInt
 * - Not be just 'n' or '-n' (must have actual digits)
 */
function isBigIntLiteral(input: string): boolean {
  const numericPart = input.slice(0, -1)

  if (!input.endsWith('n') || numericPart === '' || numericPart === '-') {
    return false
  }

  try {
    return typeof BigInt(numericPart) === 'bigint'
  }
  catch {
    return false
  }
}

export default {
  isBigIntLiteral,
}
