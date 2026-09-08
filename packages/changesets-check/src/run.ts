import { assembleReleasePlan } from '@changesets/assemble-release-plan'
import { readConfig } from '@changesets/config'
import { ExitError } from '@changesets/errors'
import { readPreState } from '@changesets/pre'
import { readChangesets } from '@changesets/read'
import { getPackages } from '@manypkg/get-packages'

export const run = async () => {
  const cwd = process.cwd()

  const packages = await getPackages(cwd)
  const { config, errors } = await readConfig(cwd, packages)
  if (errors !== undefined) {
    throw new ExitError(1, { cause: new Error(errors.join('\n')) })
  }
  const preState = await readPreState(packages.rootDir)

  let changesets
  try {
    changesets = await readChangesets(packages.rootDir)
  } catch (error) {
    const normalizedError = error instanceof Error ? error : new Error(String(error))
    console.error(`Failed to parse changesets:\n${normalizedError.message}`)
    throw new ExitError(1, { cause: normalizedError })
  }

  try {
    assembleReleasePlan(changesets, packages, config, preState)
  } catch (error) {
    const normalizedError = error instanceof Error ? error : new Error(String(error))
    console.error(`Invalid changesets detected:\n${normalizedError.message}`)
    throw new ExitError(1, { cause: normalizedError })
  }

  console.info(`All ${changesets.length} changeset(s) are valid.`)
}
