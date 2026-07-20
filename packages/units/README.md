# `@scaleway/units`

A JS library to handle units and unit conversion

- [Install](#install)
- [`convertUnits`](#convertunits)
  - [Usage](#usage)
  - [Why two bases?](#why-two-bases)
  - [Supported units](#supported-units)
- [`convertDuration`](#convertduration)
  - [Usage](#usage-1)
  - [How it works](#how-it-works)
  - [Supported units](#supported-units-1)
  - [⚠️ Months and years are approximations](#-months-and-years-are-approximations)
- [Constants](#constants)
- [API](#api)
  - [`convertUnit(amount, options)`](#convertunitamount-options)
  - [`convertDuration(amount, options)`](#convertdurationamount-options)

## Install

```bash
$ pnpm add @scaleway/units
```

## `convertUnits`

A tiny utility for converting numeric values between unit prefixes (bytes ↔ kilobytes, bits ↔ megabits, grams ↔ kilograms, etc.), supporting both **SI\*- (decimal, base 10) and **IEC\*- (binary, base 2) prefixes.

The prefixes themselves are unit-agnostic — `convertUnit` doesn't know or care whether `amount` represents bytes, grams, or anything else. The `base` option (10 or 2) is what determines the actual multiplier, so IEC (binary) prefixes only make sense for quantities that are naturally measured in powers of 2, like data.

See [Binary prefix (Wikipedia)](https://en.wikipedia.org/wiki/Binary_prefix) for background on why these two systems exist and how they differ.

### Usage

```typescript
import { convertUnit } from './convertUnit'

// 1500 bytes -> kilobytes (decimal / SI)
convertUnit(1500, { from: 'unit', to: 'kilo' })
// => 1.5

// 2 mebibytes -> bytes (binary / IEC)
convertUnit(2, { from: 'mega', to: 'unit', base: 2 })
// => 2097152

// 500 gigabytes -> terabytes (decimal / SI)
convertUnit(500, { from: 'giga', to: 'tera' })
// => 0.5

// 2.5 kilograms -> grams (decimal / SI)
// convertUnit isn't data-specific — it works for any SI quantity
convertUnit(2.5, { from: 'kilo', to: 'unit' })
// => 2500
```

### Why two bases?

| System | Base | Example                      |
| ------ | ---- | ---------------------------- |
| SI     | 10   | 1 kilobyte (kB) = 1000 bytes |
| IEC    | 2    | 1 kibibyte = 1024 bytes      |

Storage vendors typically advertise capacity in SI (decimal) units, while operating systems often report size in IEC (binary) units — this is why a "500 GB" drive shows up as roughly 465 GB in your file explorer. `convertUnit` lets you convert correctly under either convention by passing `base: 10` or `base: 2`.

### Supported units

```
unit → kilo → mega → giga → tera → peta → exa → zetta → yotta
```

`from` and `to` can be any two of these units, in either direction — the function computes the exponent difference between them for the selected base, so you're not limited to converting to/from `'unit'`.

## `convertDuration`

A tiny utility for converting numeric durations between time units — milliseconds, seconds, minutes, hours, days, weeks, months, and years.

### Usage

```typescript
import { convertDuration } from './convertDuration'

// 90 seconds -> minutes
convertDuration(90, { from: 'seconds', to: 'minutes' })
// => 1.5

// 3 hours -> milliseconds
convertDuration(3, { from: 'hours', to: 'milliseconds' })
// => 10800000

// 2 weeks -> days
convertDuration(2, { from: 'weeks', to: 'days' })
// => 14

// 18 months -> years
convertDuration(18, { from: 'months', to: 'years' })
// => 1.5
```

### How it works

All conversions go through milliseconds as an intermediate step: `amount` is converted from the `from` unit to milliseconds, then from milliseconds to the `to` unit.

### Supported units

```
milliseconds | seconds | minutes | hours | days | weeks | months | years
```

### ⚠️ Months and years are approximations

This utility uses a \*_fixed 365-day year_- with no leap-year adjustment, and derives `months` from it:

- 1 year = 365 days
- 1 month = 365 / 12 ≈ 30.4167 days (\*_not_- a calendar month — every month is treated as the same length)

This means:

- Conversions involving `months` or `years` will drift from real calendar dates (e.g. they won't account for February being shorter, or leap years adding a day).
- `convertDuration` is best suited for approximate/relative durations (e.g. "roughly how many hours is 3 months"), not for calendar-accurate date arithmetic. For exact calendar math, use a date library (e.g. `date-fns`, `Luxon`, `Day.js`) instead.

## Constants

This package also exports some predefined constants:

```ts
SECONDS_IN_MINUTE
SECONDS_IN_HOUR
SECONDS_IN_DAY
SECONDS_IN_MONTH
DAYS_IN_WEEK
DAYS_IN_MONTH
DAYS_IN_YEAR
HOURS_IN_DAY
HOURS_IN_MONTH
HOURS_IN_YEAR
MONTHS_IN_YEAR
```

## API

### `convertUnit(amount, options)`

Converts `amount` from one unit prefix to another.

| Parameter      | Type                          | Description                                                |
| -------------- | ----------------------------- | ---------------------------------------------------------- |
| `amount`       | `number`                      | The value to convert.                                      |
| `options.from` | `Unit` \*(default: `'unit'`)- | The prefix `amount` is currently expressed in.             |
| `options.to`   | `Unit` \*(default: `'unit'`)- | The prefix to convert `amount` into.                       |
| `options.base` | `2 \| 10` \*(default: `10`)-  | `10` for SI/decimal prefixes, `2` for IEC/binary prefixes. |

Returns a `number`: `amount` expressed in the `to` unit.

### `convertDuration(amount, options)`

Converts `amount` from one time unit to another.

| Parameter      | Type                             | Description                                  |
| -------------- | -------------------------------- | -------------------------------------------- |
| `amount`       | `number`                         | The duration to convert.                     |
| `options.from` | `Unit` \*(default: `'seconds'`)- | The unit `amount` is currently expressed in. |
| `options.to`   | `Unit` \*(default: `'seconds'`)- | The unit to convert `amount` into.           |

Returns a `number`: `amount` expressed in the `to` unit.
