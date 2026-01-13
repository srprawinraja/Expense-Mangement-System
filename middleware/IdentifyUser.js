const User = require('../models/User');
const { randomUUID } = require('crypto'); 

const identifyUser = async (req, res, next) => {
  try {
    let userId = req.headers['x-user-id'];

    let user = await User.findOne({ userId });

    if (!user) {
      user = await User.create({ userId, isGuest: true });
    }

    req.user = user;

    next(); 
  } catch (err) {
    next(err);
  }
};

module.exports = identifyUser;
