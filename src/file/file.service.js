const fs = require('fs')
const path = require('path')
const { Z_FIXED } = require('zlib')
const { basePath } = require('./utile')

class FileService {
  createDir(file) {
    const filesPath = path.join(basePath, `${file.userId}`, file.path)
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filesPath)) {
          fs.mkdirSync(filesPath, { recursive: true })
          return resolve({ message: 'Dir was creted' })
        } else {
          return reject({ message: 'Dir already exist' })
        }
      } catch (error) {
        return reject({ message: 'Dir error' })
      }
    })
  }

  removeFileLocal(file) {
    const filePath = path.join(basePath, `${file.userId}`, `${file.path}`)
    if (file.type === 'dir') {
      fs.rmdirSync(filePath)
    } else {
      fs.unlinkSync(filePath)
    }
  }
}
module.exports = new FileService()
