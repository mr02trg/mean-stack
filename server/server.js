
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

// request handling
const app = express();

// connect to db
const dbConnectionString = "mongodb+srv://tue:tldni278@cluster0-ady2d.mongodb.net/test?retryWrites=true&w=majority";
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
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");

    // continue to the next middleware
    next();
})

// POST
app.post('/api/posts', (req, res, next) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content
    });

    // save to db
    newPost.save()
            .then((result) => {
                res.status(201).json({
                    message: 'Post added successfully',
                    postId: result._id
                });
            });
});

// GET
app.get('/api/posts', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: documents
            });
        })
})

//DELETE
app.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id})
        .then(result => {
            // console.log(result);
        })
    res.status(200).json({
        message: 'Post deleted successfully'
    })
});

// expose express app and all registered middle wares
module.exports = app;