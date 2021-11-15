const config = require('../src/config').db

module.exports = {
	'development': {
		'username': config.username,
		'password': config.password,
		'database': config.database,
		'host': config.options.host,
		'dialect': config.options.dialect,
	},
	'test': {
		'username': config.username,
		'password': config.password,
		'database': config.database,
		'host': config.options.host,
		'dialect': config.options.dialect,
	},
	'production': {
		'username': config.username,
		'password': config.password,
		'database': config.database,
		'host': config.options.host,
		'dialect': config.options.dialect,
	},
}