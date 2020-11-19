import fs from 'fs'
import log from './log'

function getUrls(file = '') {
  log.info('Getting urls...')
  try {
    const data = fs.readFileSync(file, {
      encoding: 'utf8',
      flag: 'r',
    })
    const urls = data
      .split('\n')
      .filter(Boolean)
      .reduce((acc, curr) => {
        const [o, s] = curr.split(',')
        return [...acc, [o, s]]
      }, [])
    log.info('Getting urls done ✅')
    return urls || []
  } catch (error) {
    log.err(
      'Fail while parsing urls file. Did you submit a file in argument of Didiff ?',
      error,
    )
    process.exit(1)
  }
  return []
}

export default getUrls
