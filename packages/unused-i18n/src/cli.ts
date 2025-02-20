import { Command } from 'commander'
import { processTranslations } from './index'

const program = new Command()

program
  .command('display')
  .description('Display missing translations')
  .option('--srcPath path', 'Source path to search for translations')
  .option('--localPath path', 'Local path to the translation files')
  .action(async (options: { srcPath?: string; localPath?: string }) => {
    const paths =
      options.srcPath && options.localPath
        ? [{ srcPath: [options.srcPath], localPath: options.localPath }]
        : undefined
    await processTranslations({ paths, action: 'display' })
  })

program
  .command('remove')
  .description('Remove unused translations')
  .option('--srcPath path', 'Source path to search for translations')
  .option('--localPath path', 'Local path to the translation files')
  .action(async (options: { srcPath?: string; localPath?: string }) => {
    const paths =
      options.srcPath && options.localPath
        ? [{ srcPath: [options.srcPath], localPath: options.localPath }]
        : undefined
    await processTranslations({ paths, action: 'remove' })
  })

program.parse(process.argv)
