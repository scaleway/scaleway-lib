---
'@scaleway/use-i18n': patch
---

Normalize the locale before matching octet wording, so region-tagged locales like `fr-FR` get "octets" instead of "bytes". Zero now uses the CLDR plural form in English and Romanian ("0 bytes", "0 octeți"); French keeps the singular ("0 octet").
