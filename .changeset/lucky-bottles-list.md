---
"@scaleway/use-i18n": major
---

Remove the exported `NumberFormatOptions` and `IntlListFormatOptions` types, replacing them with the native `Intl.NumberFormatOptions` and `Intl.ListFormatOptions`, and drop the `@formatjs/ecma402-abstract` dependency. Consumers importing the removed types from `@scaleway/use-i18n` must switch to the `Intl.*` equivalents.
