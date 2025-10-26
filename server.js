const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000; 

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mongoDB')
  .then(() => {
    console.log('Successfully connected to MongoDB!');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

const ratingSchema = new mongoose.Schema({
  driver_id: { 
    type: Number,  
    required: true 
  },
  driver_name:{
    type:String,
    required:true
  },
  driver_age:{
    type:Number,
    required:true
  },
  parent_id: { 
    type: Number,  
    required: true 
  },
  rating_score: {
    type: Number,
    required: true,
    min: 1, 
    max: 11 
  },
  comment: {
    type: String,
    required: false, 
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now 
  }
});

const DriverRating = mongoose.model('DriverRating', ratingSchema);

app.post('/api/driver/rate', async (req, res) => {
  console.log('Received a new rating request...');

  try {
    const { driver_id,driver_name,driver_age, parent_id, rating_score, comment } = req.body;

    const newRating = new DriverRating({
      driver_id: driver_id,
      driver_name:driver_name,
      driver_age:driver_age,
      parent_id: parent_id,
      rating_score: rating_score,
      comment: comment
    });

    await newRating.save();

    res.status(201).json({ 
      success: true, 
      message: 'Rating submitted successfully!' 
    });

  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit rating.',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});