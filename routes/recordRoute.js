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
  .populate('amountType')  // only include accountType
  .populate('category')           // only include name
  .populate('accountType');
        res.status(200).json(records);
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
