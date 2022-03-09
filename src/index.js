require('./models/Users');
const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/authRoute')
const requireAuth = require('./middleware/requireAuth')

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);

const mongoUri = 'mongodb+srv://Basilica:Basilica%40007@cluster0.pyuoa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(mongoUri)

mongoose.connection.on('connected', () => {
    console.log('connected to mongo instance')
})

mongoose.connection.on('error', (err) => {
    console.error('connected to mongo instance', err)
})

app.get('/', requireAuth, (req, res) => {
    res.send(`Your email is ${req.user.email}`)
})

app.listen(3001, () => {
    console.log('Listening on port 3001')
})