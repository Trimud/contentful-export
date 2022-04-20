import { access, constants, writeFileSync } from 'fs'
import * as core from '@actions/core'

main().catch((error: any) => core.setFailed(error.message))

async function main() {
  try {
    const filePath = core.getInput('path', { required: true })
    const localesToRemove = core.getInput('localesToRemove', { required: true })
    const localesToRemoveJSON = JSON.parse(localesToRemove)

    // Return error if file doesn't exists
    access(filePath, constants.F_OK, (error: any) => {
      if (error) {
        core.setFailed(error.message)

        return null
      }
    })

    const file = require('contentful-export-yqiccqy-master.json')

    function cleanData(data: any, deleteKeys: string[]) {
      // There is nothing to be done if `data` is not an object
      if (typeof data != 'object') return
      if (!data) return // null object

      for (const key in data) {
        if (deleteKeys.includes(key)) {
          delete data[key]
        } else {
          // If the key is not deleted from the current `data` object,
          // the value should be check for black-listed keys.
          cleanData(data[key], localesToRemoveJSON)
        }
      }
    }

    cleanData(file, localesToRemoveJSON)

    // Overwrite existing file
    writeFileSync(filePath, JSON.stringify(file))
  } catch (error: any) {
    core.setFailed(error.message)
  }
}
