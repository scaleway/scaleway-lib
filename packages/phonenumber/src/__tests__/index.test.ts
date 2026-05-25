import { describe, it, expect } from 'vitest'
import {
  parsePhoneNumber,
  parsePhoneValue,
  formatPhoneNumber,
  validatePhoneNumber,
  getPhoneExample,
  getPhoneCountryFlag,
} from '..'

describe('parsePhoneNumber (from awesome-phonenumber)', () => {
  it('should parse a valid French phone number', () => {
    const result = parsePhoneNumber('+33612345678')
    expect(result.valid).toBe(true)
    expect(result.number?.e164).toBe('+33612345678')
    expect(result.regionCode).toBe('FR')
    expect(result.countryCode).toBe(33)
  })

  it('should parse a valid French phone number with region code option', () => {
    const result = parsePhoneNumber('0612345678', { regionCode: 'FR' })
    expect(result.valid).toBe(true)
    expect(result.number?.e164).toBe('+33612345678')
    expect(result.regionCode).toBe('FR')
  })

  it('should return invalid for an invalid phone number', () => {
    const result = parsePhoneNumber('invalid')
    expect(result.valid).toBe(false)
    expect(result.possible).toBe(false)
  })

  it('should parse a US phone number', () => {
    const result = parsePhoneNumber('+14155552671')
    expect(result.valid).toBe(true)
    expect(result.regionCode).toBe('US')
    expect(result.countryCode).toBe(1)
  })

  it('should parse a US phone number with region code', () => {
    const result = parsePhoneNumber('6123456789', { regionCode: 'US' })
    expect(result.valid).toBe(true)
    expect(result.regionCode).toBe('US')
  })

  it('should parse a UK phone number', () => {
    const result = parsePhoneNumber('+442071234567')
    expect(result.valid).toBe(true)
    expect(result.regionCode).toBe('GB')
    expect(result.countryCode).toBe(44)
  })

  it('should identify mobile number type', () => {
    const result = parsePhoneNumber('+33612345678')
    expect(result.type).toBe('mobile')
    expect(result.typeIsMobile).toBe(true)
  })

  it('should identify fixed-line number type', () => {
    const result = parsePhoneNumber('+33142345678')
    expect(result.type).toBe('fixed-line')
    expect(result.typeIsFixedLine).toBe(true)
  })

  it('should return all number formats', () => {
    const result = parsePhoneNumber('+33612345678')
    expect(result.number?.e164).toBe('+33612345678')
    expect(result.number?.international).toBe('+33 6 12 34 56 78')
    expect(result.number?.national).toBe('06 12 34 56 78')
    expect(result.number?.rfc3966).toBe('tel:+33-6-12-34-56-78')
    expect(result.number?.significant).toBe('612345678')
  })
})

describe('parsePhoneValue', () => {
  it('should parse a valid French phone number', () => {
    const result = parsePhoneValue('+33612345678')
    expect(result.valid).toBe(true)
    expect(result.e164).toBe('+33612345678')
    expect(result.country).toBe('FR')
    expect(result.formatted).toBe('+33 6 12 34 56 78')
  })

  it('should parse a French phone number without country code', () => {
    const result = parsePhoneValue('0612345678')
    expect(result.valid).toBe(true)
    expect(result.e164).toBe('+33612345678')
    expect(result.country).toBe('FR')
  })

  it('should return invalid for an invalid phone number', () => {
    const result = parsePhoneValue('invalid')
    expect(result.valid).toBe(false)
    expect(result.e164).toBeNull()
    expect(result.international).toBeNull()
    expect(result.national).toBeNull()
  })

  it('should return invalid for a too short number', () => {
    const result = parsePhoneValue('1234')
    expect(result.valid).toBe(false)
  })

  it('should preserve input value when invalid', () => {
    const result = parsePhoneValue('notaphone')
    expect(result.inputValue).toBe('notaphone')
    expect(result.formatted).toBe('notaphone')
  })

  it('should parse a US phone number', () => {
    const result = parsePhoneValue('+14155552671')
    expect(result.valid).toBe(true)
    expect(result.e164).toBe('+14155552671')
    expect(result.country).toBe('US')
  })
})

describe('formatPhoneNumber', () => {
  it('should format in E164 format', () => {
    const result = formatPhoneNumber('+33612345678', { format: 'e164' })
    expect(result).toBe('+33612345678')
  })

  it('should format in international format', () => {
    const result = formatPhoneNumber('+33612345678', { format: 'international' })
    expect(result).toBe('+33 6 12 34 56 78')
  })

  it('should format in national format', () => {
    const result = formatPhoneNumber('+33612345678', { format: 'national' })
    expect(result).toBe('06 12 34 56 78')
  })

  it('should format in RFC3966 format', () => {
    const result = formatPhoneNumber('+33612345678', { format: 'rfc3966' })
    expect(result).toBe('tel:+33-6-12-34-56-78')
  })

  it('should use international format by default', () => {
    const result = formatPhoneNumber('+33612345678')
    expect(result).toBe('+33 6 12 34 56 78')
  })

  it('should return original value for invalid phone number', () => {
    const result = formatPhoneNumber('invalid', { format: 'e164' })
    expect(result).toBe('invalid')
  })

  it('should format with region code', () => {
    const result = formatPhoneNumber('0612345678', { regionCode: 'FR', format: 'international' })
    expect(result).toBe('+33 6 12 34 56 78')
  })

  it('should format a US phone number', () => {
    const result = formatPhoneNumber('+14155552671', { format: 'international' })
    expect(result).toBe('+1 415-555-2671')
  })

  it('should format a UK phone number', () => {
    const result = formatPhoneNumber('+442071234567', { format: 'international' })
    expect(result).toBe('+44 20 7123 4567')
  })
})

describe('validatePhoneNumber', () => {
  it('should return true for a valid French phone number', () => {
    expect(validatePhoneNumber('+33612345678')).toBe(true)
  })

  it('should return false for an invalid phone number', () => {
    expect(validatePhoneNumber('invalid')).toBe(false)
  })

  it('should validate with region code', () => {
    expect(validatePhoneNumber('0612345678', { regionCode: 'FR' })).toBe(true)
  })

  it('should validate a US phone number with region code', () => {
    expect(validatePhoneNumber('6123456789', { regionCode: 'US' })).toBe(true)
  })

  it('should return false for invalid number with region code', () => {
    expect(validatePhoneNumber('123456', { regionCode: 'FR' })).toBe(false)
  })

  it('should validate a UK phone number', () => {
    expect(validatePhoneNumber('+442071234567')).toBe(true)
  })

  it('should validate a toll-free number', () => {
    expect(validatePhoneNumber('+33800123456')).toBe(true)
  })
})

describe('getPhoneExample', () => {
  it('should return an example number for France', () => {
    const example = getPhoneExample('FR')
    expect(example.number?.e164).toMatch(/^\+33/)
  })

  it('should return an example number for US', () => {
    const example = getPhoneExample('US')
    expect(example.number?.e164).toMatch(/^\+1/)
  })

  it('should return an example number for UK', () => {
    const example = getPhoneExample('GB')
    expect(example.number?.e164).toMatch(/^\+44/)
  })

  it('should return an example mobile number for France', () => {
    const example = getPhoneExample('FR', 'mobile')
    expect(example.number?.e164).toMatch(/^\+33[67]/)
  })
})

describe('getPhoneCountryFlag', () => {
  it('should return flag emoji for France', () => {
    expect(getPhoneCountryFlag('FR')).toBe('🇫🇷')
  })

  it('should return flag emoji for US', () => {
    expect(getPhoneCountryFlag('US')).toBe('🇺🇸')
  })

  it('should return flag emoji for UK', () => {
    expect(getPhoneCountryFlag('GB')).toBe('🇬🇧')
  })

  it('should return flag emoji for Germany', () => {
    expect(getPhoneCountryFlag('DE')).toBe('🇩🇪')
  })

  it('should return flag emoji for Spain', () => {
    expect(getPhoneCountryFlag('ES')).toBe('🇪🇸')
  })
})

describe('edge cases', () => {
  it('should handle empty string', () => {
    const result = parsePhoneNumber('')
    expect(result.valid).toBe(false)
  })

  it('should handle phone number with spaces', () => {
    const result = parsePhoneNumber('+33 6 12 34 56 78')
    expect(result.valid).toBe(true)
    expect(result.number?.e164).toBe('+33612345678')
  })

  it('should handle phone number with dashes', () => {
    const result = parsePhoneNumber('+33-6-12-34-56-78')
    expect(result.valid).toBe(true)
    expect(result.number?.e164).toBe('+33612345678')
  })

  it('should handle phone number with dots', () => {
    const result = parsePhoneNumber('+33.6.12.34.56.78')
    expect(result.valid).toBe(true)
    expect(result.number?.e164).toBe('+33612345678')
  })

  it('should handle phone number with parentheses', () => {
    const result = parsePhoneNumber('+33(6)12345678')
    expect(result.valid).toBe(true)
  })

  it('should handle international prefix with 00', () => {
    const result = parsePhoneNumber('0033612345678', { regionCode: 'FR' })
    expect(result.valid).toBe(true)
    expect(result.number?.e164).toBe('+33612345678')
  })

  it('should handle premium rate number', () => {
    const result = parsePhoneNumber('+33891234567')
    expect(result.valid).toBe(true)
    expect(result.type).toBe('premium-rate')
  })

  it('should handle toll-free number', () => {
    const result = parsePhoneNumber('+33800123456')
    expect(result.valid).toBe(true)
    expect(result.type).toBe('toll-free')
  })
})

describe('international phone numbers', () => {
  it('should parse German phone number', () => {
    const result = parsePhoneNumber('+4930123456')
    expect(result.valid).toBe(true)
    expect(result.regionCode).toBe('DE')
  })

  it('should parse Spanish phone number', () => {
    const result = parsePhoneNumber('+34912345678')
    expect(result.valid).toBe(true)
    expect(result.regionCode).toBe('ES')
  })

  it('should parse Italian phone number', () => {
    const result = parsePhoneNumber('+390612345678')
    expect(result.valid).toBe(true)
    expect(result.regionCode).toBe('IT')
  })

  it('should parse Belgian phone number', () => {
    const result = parsePhoneNumber('+32470123456')
    expect(result.valid).toBe(true)
    expect(result.regionCode).toBe('BE')
  })

  it('should parse Swiss phone number', () => {
    const result = parsePhoneNumber('+41441234567')
    expect(result.valid).toBe(true)
    expect(result.regionCode).toBe('CH')
  })

  it('should parse Canadian phone number', () => {
    const result = parsePhoneNumber('+14185551234')
    expect(result.valid).toBe(true)
    expect(result.regionCode).toBe('CA')
  })

  it('should parse Australian phone number', () => {
    const result = parsePhoneNumber('+61291234567')
    expect(result.valid).toBe(true)
    expect(result.regionCode).toBe('AU')
  })

  it('should parse Japanese phone number', () => {
    const result = parsePhoneNumber('+81312345678')
    expect(result.valid).toBe(true)
    expect(result.regionCode).toBe('JP')
  })
})
