const express = require('express')
const app = express()
const mongoose = require('mongoose')
const moment = require('moment')
const bodyParser = require('body-parser')
const Expense = require("./server/model/Expense")
const api = require('./server/routes/api')
const data = require('./data.json')

mongoose.connect("mongodb://localhost/expense-project", {useNewUrlParser: true })

// data.forEach(d => {
//     const newExpense = new Expense ({
//         name: d.item,
//         amount: d.amount,
//         date: d.date,
//         group: d.group,
//     })
//     newExpense.save()
// })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', api)

app.listen(5000, function(){
    console.log("Server up and running on port 3000")
})
