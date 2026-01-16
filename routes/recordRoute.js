const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const { getSignedUrlFromKey } = require('../utils/s3Upload');

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
    const id = req.query.id
    
    if(id){
        
        const record = await Record.findById(id)
        .populate('accountType')  
        .populate('category');
        if(!record){
            res.status(200).json({error: "no record found"});
        }

        for(const index in record.note.imgs){
            const img = record.note.imgs[index]
            record.note.imgs[index] = await getSignedUrlFromKey(img)
        }
        
        
        res.status(200).json(record);
    }    
    const records = await Record.find()
    .populate('accountType')  
    .populate('category');
    for(const record of records){
        for(const index in record.note.imgs){
            const img = record.note.imgs[index]
            record.note.imgs[index] = await getSignedUrlFromKey(img)
        }
    }
    res.status(200).json(records);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/date', async (req, res) => {
    try {
        const date = req.query.date
        const page = req.query.page;
        const limit = req.query.limit;
        if(!date || !page || !limit){
            res.status(400).json({ error: "missing date or page or limit" });
        }
        const skip = (page - 1) * limit;
        const startDateTime = new Date(date);       
        const endDateTime = new Date(date);          
        endDateTime.setHours(23, 59, 59, 999); 
        const filteredRecords = await Record.find({
            dateAndTime: {
                $gte: startDateTime,
                $lte: endDateTime
            }
        })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate('accountType')  
        .populate('category');

        const records = []

        for(const record of filteredRecords){
            records.push(
                {
                    "categoryName": record.category.categoryName,
                    "isIncome": record.category.isIncome,
                    "title": record.title,
                    "accountTypeName": record.accountType.accountTypeName,
                    "amount": record.amount
                }
            )
        }

        
        const totalRecords = await (await Record.find()).length
        const totalPages = Math.ceil(totalRecords / limit)

         res.status(200).json(
            {
                "page": page,
                "limit": limit,
                "totalRecords": totalRecords,
                "totalPages": totalPages,
                "records":records
            }
        );
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

        for(const record of records){

            const date = new Date(record.dateAndTime);
            const onlyDate = date.toISOString().split("T")[0];
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
            if(!map.has(onlyDate)){
                map.set(onlyDate, {
                    date: onlyDate,
                    dayName: dayName,
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
                    dayName: detail.dayName,
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
