import { promises as fs } from 'fs'
import * as core from '@actions/core'

main().catch((error: any) => core.setFailed(error.message))

async function main() {
  try {
    const filePath = core.getInput('path', { required: true })
    const localesToRemove = core.getInput('localesToRemove', { required: true })
    const localesToRemoveJSON = JSON.parse(localesToRemove)

    const readFile = async (file: string) => {
      try {
        return await fs.readFile(file, 'utf8')
      } catch (err) {
        console.log(err)
      }
    }

    const file = readFile(filePath)

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

    fs.writeFile(
      'contentful-export-yqiccqy-master-2.json',
      JSON.stringify(file)
    )
  } catch (error: any) {
    core.setFailed(error.message)
  }
}
