const fs = require('fs')
const path = require('path')

class FileService {
	createDir(file) {
		const filesPath = path.join('files', `${ file.userId }`, file.path)
		return new Promise((resolve, reject) => {
			try {
				if ( !fs.existsSync(filesPath) ) {
					fs.mkdirSync(filesPath, { recursive: true })
					return resolve({ message: 'Dir was created' })
				} else {
					return reject({ message: 'Dir already exist' })
				}
			} catch ( error ) {
				return reject({ message: 'Dir error' })
			}
		})
	}

	removeFileLocal(file) {
		const filePath = path.join('files', `${ file.userId }`, `${ file.path.replace('files/', '') }`)
		if ( file.type === 'dir' ) {
			fs.rmdirSync(filePath)
		} else {
			fs.unlinkSync(filePath)
		}
	}
}

module.exports = new FileService()
