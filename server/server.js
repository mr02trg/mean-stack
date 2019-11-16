
const express = require('express');
const bodyParser = require('body-parser');

// request handling
const app = express();

// parsing json object
app.use(bodyParser.json());

// allow cors
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");

    // continue to the next middleware
    next();
})

app.post('/api/posts', (req, res, next) => {
    const newPost = req.body;
    res.status(201).json({
        message: 'Post added successfully'
    });
});

app.use('/api/posts', (req, res, next) => {
    const posts = [
        {
            id: "1",
            title: "First server post",
            content: "This is coming from the server"
        },
        {
            id: "2",
            title: "Second server post",
            content: "This is coming from the server"
        },
    ]
    res.status(200).json({
        message: 'Posts fetched successfully',
        posts: posts
    });
})

// expose express app and all registered middle wares
module.exports = app;