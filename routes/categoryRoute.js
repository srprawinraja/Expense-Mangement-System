const express = require('express');
const router = express.Router();

const Category = require('../models/Category');

router.post('/', async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(200).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const categorys = await Category.find();
        res.status(200).json(categorys);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        const category = await Category.deleteMany();
        res.status(200).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
