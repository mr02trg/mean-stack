
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// import controllers
var postController = require('./controller/postController');

// request handling
const app = express();

// connect to db
const dbConnectionString = "mongodb+srv://tue:tldni278@cluster0-ady2d.mongodb.net/test?retryWrites=true&w=majority";
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
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    // continue to the next middleware
    next();
})

app.use('/api/posts', postController)

// expose express app and all registered middle wares
module.exports = app;