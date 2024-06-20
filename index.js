const express = require('express')
const bodyParser = require('body-parser')
const DbConnect = require('./db')
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 5000

//Connecting to MongoDB
DbConnect();
app.use(bodyParser.json())
app.use(routes)

app.listen(PORT, ()=> console.log( `App is running on port ${PORT}`))
