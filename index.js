require('dotenv').config();


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const db = require('./queries'); // assumed to be updated for MongoDB
const app = express();
const port = 3001;
const usersRouter = require('./routes/users');
const customersRouter = require('./routes/customer');



// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/winsam_db')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// const db = require('./queries');

app.use('/api/users', usersRouter);
app.use('/api/customers', customersRouter);
  
  // app.get('/users', db.getUsers)
  // app.get('/user-profile', db.getUserById)
  // app.get('/user-create', db.createUser)
  // app.get('/updateuser-profile',db.updateUser)
  // app.get('/deleteuser-profile',db.deleteUser)
  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })