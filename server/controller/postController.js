
var express = require('express');
var router = express.Router();

const Post = require('../models/post');

router.post('', (req, res, next) => {
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

router.get('', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: documents
            });
        })
})

router.delete('/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id})
        .then(result => {
            // console.log(result);
        })
    res.status(200).json({
        message: 'Post deleted successfully'
    })
});

module.exports = router;