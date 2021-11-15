const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const File = sequelize.define('file', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, require: true, allowNull: false },
	type: { type: DataTypes.STRING },
	link: { type: DataTypes.STRING },
	size: { type: DataTypes.BIGINT, defaultValue: 0 },
	path: { type: DataTypes.STRING, defaultValue: '' },
	userId: { type: DataTypes.INTEGER, require: true, allowNull: false },
	parent: { type: DataTypes.INTEGER },
	childs: DataTypes.ARRAY({ type: DataTypes.INTEGER }),
})

module.exports = File
