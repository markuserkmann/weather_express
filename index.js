const express = require('express')
const app = express()
const path = require('path')
const fs = require('node:fs')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(3002, (t) => {
    console.log("Listening on 3002")
})