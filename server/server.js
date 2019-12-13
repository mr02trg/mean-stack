
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()

// import controllers
const postController = require('./controller/postController');
const userController = require('./controller/userController');
const publicController = require('./controller/publicController');

// request handling
const app = express();

// connect to db
const dbConnectionString = `mongodb+srv://${process.env.DB_HOSTNAME}:${process.env.DB_PASSWORD}@cluster0-ady2d.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.set('useFindAndModify', false);
mongoose.connect(dbConnectionString, {useUnifiedTopology: true, useNewUrlParser: true})
        .then(() => {
            console.log('Connected to database');
        })
        .catch(() => {
            console.log('Connection failed');
        });

// parsing json object
app.use(bodyParser.json());

// allow cors
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    // continue to the next middleware
    next();
})

// register user controller
app.use('/api/users', userController)

// register post controller
app.use('/api/posts', postController)

// register public controller
app.use('/api/public', publicController)


// expose express app and all registered middle wares
module.exports = app;