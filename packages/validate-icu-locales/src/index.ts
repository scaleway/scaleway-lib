import { parse } from '@formatjs/icu-messageformat-parser'
import glob from 'glob'

const args = process.argv.slice(2)
const paths = args[0]

const { error, table, info } = console

info(paths)

const findICUError = (
  locales: { [key: string]: string },
  filePath?: string,
) => {
  Object.keys(locales).forEach(key => {
    const value = locales[key]

    try {
      parse(value)
    } catch (err) {
      error({ err, value, key, filePath })
    }
  })
}

const readFiles = (files: string[]) =>
  files.forEach(file => {
    import(file)
      .then(({ default: locales }: { default: Record<string, string> }) => {
        findICUError(locales, file)
      })
      .catch(err => {
        error(err)
      })
  })

const main = () => {
  glob(paths, (err, files) => {
    if (err) {
      error({
        err,
      })
    }

    if (files) {
      table(files)
      readFiles(files)
    }
  })
}

main()
