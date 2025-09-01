import scopes from '@commitlint/config-workspace-scopes'

export default {
  extends: ['@commitlint/config-conventional', '@commitlint/config-workspace-scopes'],
  rules: {
    'scope-enum': async (ctx) => {
      const scopeEnum = await scopes.rules['scope-enum'](ctx)
      return [
        scopeEnum[0],
        scopeEnum[1],
        [
          ...scopeEnum[2],
          'deps',     // for Dependabot or Renovate - dependency updates
          'dev-deps', // for Dependabot or Renovate - dev dependency updates
          'release'   // for release commits
        ]
      ]
    }
  },
  prompt: {
    settings: {
      enableMultipleScopes: true
    }
  }
}