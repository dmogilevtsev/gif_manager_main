const Router = require('express')
const authMiddleware = require('./auth.middleware')
const fileController = require('./file.controller')

const router = new Router()

router.post('/', authMiddleware, fileController.createDir)
router.post('/upload', authMiddleware, fileController.uploadFile)
router.get('/', authMiddleware, fileController.getFolder)
router.get('/download', authMiddleware, fileController.downLoadFile)
router.delete('/', authMiddleware, fileController.removeFile)

module.exports = router
