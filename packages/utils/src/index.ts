/**
 * Scaleway Lib Utilities
 *
 * A collection of utility functions and scripts for scaleway-lib
 */

// Export types
export type {
  DependencyError,
  WorkspaceData,
} from './check-catalog-usage.ts'
// Export the catalog validation functions
export {
  checkDependencies,
  findWorkspaceFile,
  getCatalogPackages,
  main as checkCatalogUsage,
} from './check-catalog-usage.ts'

// Export other utilities as they are added
