# `@scaleway/countries`

ISO 3166/3166-2 coutries JSON database

This package only holds and publish json files

---

## Install

```bash
$ pnpm add @scaleway/countries
```

## Usage

```js
import countries from '@scaleway/countries'
import frenchSubdivisions from '@scaleway/countries/subdivisions/FR'

console.log(countries) // => [{ "name": "Afghanistan", "dial_code": "+93", "code": "AF", "flag": "🇦🇫" }, ...]

console.log(frenchSubdivisions) // => [{ "code": "FR-01", "country_code": "FR", "name": "Ain", "parent_code": "FR-ARA", "type": "Metropolitan department" }, ... ]
```

## Generation

This package is generated manually from a pypi library [pycountry](https://pypi.org/project/pycountry/)

To update the database, first make sure that you have:

- [python](https://www.python.org) >= 3.0
- [poetry](https://python-poetry.org) >= 1.0

And then:

```bash
$ pnpm run generate
```
