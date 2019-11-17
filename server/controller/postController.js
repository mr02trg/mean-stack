
var express = require('express');
var router = express.Router();

const Post = require('../models/post');

router.get('', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: documents
            });
        })
})

router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id)
        .then(document => {
            res.status(200).json({
                message: 'Posts fetched successfully',
                post: document
            });
        }, error => {
            res.status(400).json({
                message: 'Unable to fetch post',
                post: null
            })
        });
});

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

router.put('/:id', (req, res, next) => {
    Post.findByIdAndUpdate(req.params.id, req.body)
        .then(result => {
            res.status(200).json({
                message: 'Unable to update post',
                post: result
            })
        }, error => {
            res.status(400).json({
                message: 'Unable to update post',
                post: null
            })
        })
});

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