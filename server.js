require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();



// Import routes
const accountTypeRoute = require('./routes/accountTypeRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');
const recordRoute = require('./routes/recordRoute');
const uploadingImgRoute = require('./routes/uploadRoute')
const identifyUser = require('./middleware/identifyUser');



// Middleware to parse JSON
app.use(express.json());
app.use('/accountType', accountTypeRoute);
app.use('/category', categoryRoute);
app.use('/user', userRoute);
app.use('/record', recordRoute);
app.use('/upload', uploadingImgRoute);


async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1); // exit app if DB connection fails
  }
}

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


