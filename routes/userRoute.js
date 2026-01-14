const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (userId) {
            const user = await User.findOne({
                userId: userId
            });
            if(!user){
                res.status(401).json({ error: 'user not found' });
            }
            res.status(200).json(user);
        }
        const users = await User.find()
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        const user = await User.deleteMany();
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});





module.exports = router;
