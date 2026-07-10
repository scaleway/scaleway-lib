// We support both SI and IEC
// https://en.wikipedia.org/wiki/Binary_prefix

const exponents = {
  unit: {
    si: 3,
    iec: 0,
  },
  // kilo
  kilo: {
    si: 6,
    iec: 10,
  },
  // mega
  mega: {
    si: 9,
    iec: 20,
  },
  // giga
  giga: {
    si: 12,
    iec: 30,
  },
  // tera
  tera: {
    si: 15,
    iec: 40,
  },
  // peta
  peta: {
    si: 18,
    iec: 50,
  },
  // exa
  exa: {
    si: 21,
    iec: 60,
  },
  // zetta
  zetta: {
    si: 24,
    iec: 70,
  },
  // yotta
  yotta: {
    si: 27,
    iec: 80,
  },
} as const

type Unit = keyof typeof exponents

type ConvertUnitArgs = {
  from?: Unit
  to?: Unit
  base?: 2 | 10
}

/**
 * Converts a numeric amount from one unit prefix to another, using either
 * SI (decimal, base 10) or IEC (binary, base 2) prefixes.
 *
 * The conversion is purely based on the exponent difference between `from`
 * and `to` for the chosen base, so any pair of supported units can be
 * converted directly in either direction (e.g. `mega` → `unit`, or
 * `tera` → `giga`). This isn't limited to bytes/bits — any decimal-prefixed
 * quantity (grams, meters, etc.) works the same way with `base: 10`.
 *
 * @see https://en.wikipedia.org/wiki/Binary_prefix
 *
 * @param amount - The numeric value to convert.
 * @param options - Conversion options.
 * @param options.from - Unit prefix of `amount`. Defaults to `'unit'` (no prefix).
 * @param options.to - Unit prefix to convert `amount` into. Defaults to `'unit'` (no prefix).
 * @param options.base - `10` for SI/decimal prefixes (1 kilo = 1000) or `2` for
 *   IEC/binary prefixes (1 kilo = 1024). Defaults to `10`.
 *
 * @returns `amount` expressed in the `to` unit.
 *
 * @example
 * // 1500 bytes -> kilobytes (decimal)
 * convertUnit(1500, { from: 'unit', to: 'kilo' }) // 1.5
 *
 * @example
 * // 2 mebibytes -> bytes (binary)
 * convertUnit(2, { from: 'mega', to: 'unit', base: 2 }) // 2097152
 *
 * @example
 * // 500 gigabytes -> terabytes (decimal)
 * convertUnit(500, { from: 'giga', to: 'tera' }) // 0.5
 *
 * @example
 * // 2.5 kilograms -> grams (decimal) — works for any SI quantity, not just data
 * convertUnit(2.5, { from: 'kilo', to: 'unit' }) // 2500
 */
export const convertUnit = (amount: number, { from = 'unit', to = 'unit', base = 10 }: ConvertUnitArgs) => {
  const prefix = base === 10 ? 'si' : 'iec'
  const power = exponents[from][prefix] - exponents[to][prefix]

  return amount * Math.pow(base, power)
}
