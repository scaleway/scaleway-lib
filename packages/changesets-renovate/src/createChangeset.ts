import { writeFile } from 'node:fs/promises'
import { env } from 'node:process'

export async function createChangeset(
  fileName: string,
  packageBumps: Map<string, string>,
  packages: string[],
): Promise<void> {
  const messageLines: string[] = []

  for (const [pkg, bump] of packageBumps) {
    messageLines.push(`Updated dependency \`${pkg}\` to \`${bump}\`.`)
  }

  if (env['SORT_CHANGESETS']) {
    packages.sort()
    messageLines.sort()
  }

  const message = messageLines.join('\n')
  const pkgs = packages.map(pkg => `'${pkg}': patch`).join('\n')
  const body = `---\n${pkgs}\n---\n\n${message.trim()}\n`
  await writeFile(fileName, body)
}
