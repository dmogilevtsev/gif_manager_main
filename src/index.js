const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const config = require('./config')
const sequelize = require('./db')
const fileRouter = require('./file/file.router')

const app = express()

app.use(
	cors({
		credentials: true,
		origin: config.client_url,
	}),
)

app.use(fileUpload({}))
app.use(express.json())
app.use('/api/file', fileRouter)
app.use(express.static('files'))

const start = async () => {
	try {
		await connectDb()
		await sequelize.sync()
	} catch ( err ) {
		console.log(err)
	}
	app.listen(config.port, (err) => {
		if ( err ) {
			return console.log(`Server down. Error: ${ err.message }`)
		}
		console.log(`Server has been started on ${ config.host }${ config.port }/`)
	})
}

start()

async function connectDb(retries = 5) {
	while ( retries ) {
		try {
			await sequelize.authenticate()
			break
		} catch ( err ) {
			console.log(err)
			retries -= 1
			console.log(`retries left: ${ retries }`)
			await new Promise((res) => setTimeout(res, 5000))
		}
	}
}
