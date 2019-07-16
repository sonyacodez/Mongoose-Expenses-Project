const express = require('express')
const router = express.Router()
const moment = require('moment')
const Expense = require('../model/Expense')

router.get('/expenses/', function(req,res){
    const d1 = req.query.date1
    const d2 = req.query.date2
    if(d1,d2){
        Expense.find({
            $and:[
                {date:{$lt: d2}},
                {date: {$gt: d1}}
            ]
        },(err,result) => res.send(result)).sort({date: -1})
    }
    else if(d1){
        Expense.find({
            $and:[
                {date:{$lt: moment(new Date())}},
                {date: {$gt: d1}}
            ]
        },(err,result) => res.send(result)).sort({date: -1})
    }
    else{
        Expense.find({}, (err,result) => res.send(result)).sort({date: -1})
    }
})

router.get('/expenses/:group', function(req,res){
    const expenseGroup = req.params.group
    const isTotal = req.query.total
    if(isTotal === "true"){
        Expense.aggregate(
            [{$match:{group: expenseGroup}},
             {$group:
                    {
                    _id: null,
                    total:{$sum: "$amount"}
                    }
             }], 
            (err, result) => res.send(result)
        )
    }
    else{
        Expense.find({group: expenseGroup}, (err,groupExpenses) => res.send(groupExpenses))
    }
})

router.post('/new', function(req,res){
    const userExpense = req.body
    const userDate = req.body.date ? moment(req.body.date).format('LLLL') : moment('2020-01-01').format('LLLL')
    const newExpense = new Expense ({
        name: userExpense.name,
        amount: userExpense.amount,
        date: userDate,
        group: userExpense.group
    })
    newExpense.save()
    .then(function(newExpense){
        console.log(`You spent ${newExpense.amount} for ${newExpense.name} on ${newExpense.date}.`)
        res.end()
    })
})

router.put('/update', function(req,res){
    const expenseGroup = req.body.group1
    const updatedExpenseGroup = req.body.group2
    Expense.findOneAndUpdate(
        {group: expenseGroup}, 
        {group: updatedExpenseGroup}, 
        {new: true},
        function(err, updatedExpense){
            res.send(`You just changed ${updatedExpense.name} to ${updatedExpense.group}.`)
        }
    )
})

module.exports = router