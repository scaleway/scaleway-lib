declare namespace Intl {
  interface ListFormatOptions {
    localeMatcher: 'best fit' | 'lookup'
    type: 'conjunction' | 'disjunction' | 'unit'
    style: 'long' | 'short' | 'narrow'
  }

  interface ListFormat {
    format: (items: [string?]) => string;
  }

  const ListFormat: {
    new(locales?: string | string[], options?: ListFormatOptions): ListFormat;
  }
}
