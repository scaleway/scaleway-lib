# This file will update subcountries directory.
# For all new release of iso 6311
# Requirements:
#   - python
#   - poetry
#
# Usage:
#   $ poetry install && poetry run python generate.py
# Or simply from the package.json
#   $ pnpm run generate

import pycountry
import json


def main():
    with open("./countries.json") as out:
        data = json.load(out)
    with open("./countries.d.ts", "w") as out:
        countries_list = "' | '".join(list(map(lambda country: country["code"], data)))
        out.write(f"export type AvailableCountries = '{countries_list}'")

    for countries in data:
        sub_countries = pycountry.subdivisions.get(country_code=countries["code"])
        if sub_countries:
            with open("./subdivisions/" + countries["code"] + ".json", "w") as outfile:
                arr = []
                for b in sub_countries:
                    arr.append(
                        {
                            "code": b.code,
                            "country_code": b.country_code,
                            "name": b.name,
                            "parent_code": b.parent_code,
                            "type": b.type,
                        }
                    )
                arr.sort(key=lambda x: x["code"])
                json.dump(arr, outfile, ensure_ascii=True, indent=2, sort_keys=True)


if __name__ == "__main__":
    main()
