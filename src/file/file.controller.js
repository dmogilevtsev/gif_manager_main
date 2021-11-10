const path = require('path')
const fs = require('fs')
const ApiError = require('../error/ApiError')
const File = require('./File')
const fileService = require('./file.service')
const { basePath } = require('./utile')

class FileController {
  async createDir(req, res, next) {
    try {
      const { name, type, parent } = req.body
      let opt = { name, userId: req.user.id }
      if (parent) {
        Object.assign(opt, { parent })
      }
      const candidate = await File.findOne({ where: opt })
      if (candidate) {
        throw ApiError.badRequest(`Folder "${name}" already exist`)
      }
      const file = await File.create({
        name,
        type,
        parent,
        userId: req.user.id,
      })
      const parentFile = !!parent
        ? await File.findOne({ where: { id: parent }, raw: true })
        : null
      if (!parentFile) {
        file.path = name
        await fileService.createDir(file)
      } else {
        file.path = path.join(parentFile.path, file.name)
        await fileService.createDir(file)
        const _childs = await File.findAll({
          attributes: ['childs'],
          where: {
            id: parentFile.id,
          },
          raw: true,
        })
        let childs = _childs[0].childs
        if (childs && childs.length > 0) {
          childs.push(file.id)
        } else {
          childs = [file.id]
        }
        await File.update(
          {
            childs,
          },
          {
            where: {
              id: parentFile.id,
            },
          }
        )
      }
      await file.save()
      return res.json(file)
    } catch (error) {
      next(error)
    }
  }

  async getFolder(req, res, next) {
    try {
      const parent = req.query.parent ? +req.query.parent : null
      const userId = req.user.id
      const folders = await File.findAll({
        where: { userId, parent },
      })
      res.json(folders)
    } catch (error) {
      next(error)
    }
  }

  async uploadFile(req, res, next) {
    try {
      const file = req.files.file
      const userId = req.user.id
      const type = file.mimetype.split('/')[1].toLowerCase()
      if (type !== 'gif') {
        throw ApiError.badRequest('Not valid file type')
      }
      const parent = req.body.parent
        ? await File.findOne({
            where: { userId, id: req.body.parent },
          })
        : null
      let filePath
      if (parent) {
        filePath = path.join(basePath, `${userId}`, parent.path, file.name)
      } else {
        filePath = path.join(basePath, `${userId}`, `${file.name}`)
      }
      if (fs.existsSync(filePath)) {
        throw ApiError.badRequest('File already exist')
      }
      file.mv(filePath)
      let newFilePath = file.name
      if (parent) {
        newFilePath = path.join(parent.path, file.name)
      }
      const newFile = await File.create({
        name: file.name,
        type,
        size: file.size,
        path: newFilePath,
        parent: parent?.id,
        userId,
      })
      return res.json(newFile)
    } catch (error) {
      next(error)
    }
  }

  async downLoadFile(req, res, next) {
    try {
      console.log('download file', { id: req.query.id, userId: req.user.id })
      const file = await File.findOne({
        where: { id: req.query.id, userId: req.user.id },
      })
      const filePath = path.join(basePath, `${req.user.id}`, `${file.path}`)
      console.log('filePath', filePath)
      if (fs.existsSync(filePath)) {
        return res.download(filePath, file.name)
      }
      return res.status(400).json({ message: 'File not found' })
    } catch (error) {
      next(error)
    }
  }

  async removeFile(req, res, next) {
    try {
      const file = await File.findOne({
        where: { id: req.query.id, userId: req.user.id },
      })
      if (!file) {
        res.status(400).json({ message: 'File not fount' })
      }
      fileService.removeFileLocal(file)
      await File.destroy({ where: { id: file.id } })
      return res.json({ message: 'File was removed' })
    } catch (error) {
      return res.status(500).json({ message: 'Folder is not empty' })
    }
  }
}

module.exports = new FileController()
