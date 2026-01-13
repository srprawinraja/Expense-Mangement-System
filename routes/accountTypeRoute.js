
const express = require('express');
const router = express.Router();

const AccountType = require('../models/AccountType');

router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const accountType = await AccountType.create(req.body);
        res.status(200).json(accountType);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const accountTypes = await AccountType.find()
        res.status(200).json(accountTypes);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        const accountTypes = await AccountType.deleteMany()
        res.status(200).json(accountTypes);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


module.exports = router;
