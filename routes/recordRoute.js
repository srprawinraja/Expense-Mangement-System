const express = require('express');
const router = express.Router();

const Record = require('../models/Record');

router.post('/', async (req, res) => {
    try {
        const record = await Record.create(req.body);
        res.status(200).json(record);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
const records = await Record.find()
  .populate('accountType')  
  .populate('category');
        res.status(200).json(records);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.get('/month', async (req, res) => {
    try {
        const year = req.query.year
        const month = req.query.month;
        if(!year || !month){
            res.status(400).json({ error: "missing year or month query" });
        }
        const startDate = new Date(year, month - 1, 1); 
        const endDate = new Date(year, month, 1);       

        const records = await Record.find({
        dateAndTime: {
            $gte: startDate,
            $lt: endDate
        }
        })
        .sort({ dateAndTime: 1 })
        .populate('accountType')  
        .populate('category');
        

        const map = new Map();

        let totalIncome=0, totalExpense=0

        for(const index in records){
            const record = records[index]

            const date = new Date(record.dateAndTime);
            const onlyDate = date.toISOString().split("T")[0];

            if(!map.has(onlyDate)){
                map.set(onlyDate, {
                    date: onlyDate,
                    income: 0,
                    expense: 0,
                    total: 0
                })
            }

            const amount = record.amount

            if(record.category.isIncome){
                totalIncome+=amount
                map.get(onlyDate).income+=amount
            } else {
                totalExpense+=amount
                map.get(onlyDate).expense+=amount
            }
            map.get(onlyDate).total = map.get(onlyDate).income-map.get(onlyDate).expense
        }
        const dates=[]
  
        for(const [date, detail] of map){

            dates.push(
                {
                    date: date,
                    income: detail.income,
                    expense: detail.expense,
                    total: detail.total,
                }
            )
        }
        

        res.status(200).json(
            {
                "income":totalIncome,
                "expense":totalExpense,
                "total":(totalIncome-totalExpense),
                "dates": dates
            }
        );
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        const record = await Record.deleteMany();
        res.status(200).json(record);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
