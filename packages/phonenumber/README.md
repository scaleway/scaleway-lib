# @scaleway/phonenumber

A phone number utility library based on [awesome-phonenumber](https://github.com/grinnane/awesome-phonenumber).

## Installation

```bash
pnpm add @scaleway/phonenumber
```

## Usage

### Parse Phone Number

```typescript
import { parsePhoneNumber } from '@scaleway/phonenumber'

const phoneNumber = parsePhoneNumber('+33612345678')
console.log(phoneNumber?.number) // '+33612345678'
console.log(phoneNumber?.countryCode) // 'FR'
```

### Validate Phone Number

```typescript
import { isValidPhoneNumber } from '@scaleway/phonenumber'

console.log(isValidPhoneNumber('+33612345678')) // true
console.log(isValidPhoneNumber('invalid')) // false
```

### Format Phone Number

```typescript
import { formatPhoneNumber } from '@scaleway/phonenumber'

console.log(formatPhoneNumber('+33612345678', 'international')) // '+33 6 12 34 56 78'
console.log(formatPhoneNumber('+33612345678', 'national')) // '06 12 34 56 78'
console.log(formatPhoneNumber('+33612345678', 'e164')) // '+33612345678'
```

### Get Country Code

```typescript
import { getCountryCode } from '@scaleway/phonenumber'

console.log(getCountryCode('+33612345678')) // 'FR'
```
