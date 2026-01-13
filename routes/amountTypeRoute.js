
const express = require('express');
const router = express.Router();

const AmountType = require('../models/AmountType');

router.post('/', async (req, res) => {
    try {
        const amountType = await AmountType.create(req.body);
        res.status(200).json(amountType);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const amountTypes = await AmountType.find();
        res.status(200).json(amountTypes);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        const amountType = await AmountType.deleteMany();
        res.status(200).json(amountType);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
