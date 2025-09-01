import { Releaser } from '@simple-release/core'
import { NpmWorkspacesProject } from '@simple-release/npm'

await new Releaser({
  project: new NpmWorkspacesProject({
    mode: 'independent'
  })
})
  .bump({ extraScopes: ["deps"] })
  .commit()
  .tag()
  .push()
  .release()
  .run()