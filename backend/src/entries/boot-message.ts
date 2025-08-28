import { assert } from '../lib.ts'

export default () => {
  assert(true)

  /**
   * These will be sent to stdout by pocketbase
   */
  console.log(`PocketBase started`)
}