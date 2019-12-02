var fs = require('fs');
var _ = require('lodash');

const Post = require('../models/post');

function getPosts(req, res, next) {
    let query = Post.find();
    let totalPosts = 0;

    if (req.query) {
        const pageIndex = +req.query.pageIndex;
        const pageSize = +req.query.pageSize;
        query.skip(pageIndex*pageSize).limit(pageSize);
    }

    Post.count().then(postCount => {
        totalPosts = postCount
        return query;
    })
    .then(documents => {
        res.status(200).json({
            message: 'Posts fetched successfully',
            totalPosts: totalPosts,
            posts: documents
        });
    })
}

function getPostById(req, res, next) {
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
}

function addPost(req, res, next) {
    const serverPath = req.protocol + '://' + req.get("host");
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: serverPath + '/images/' + req.file.filename,
        author: req.userId
    });

    // save to db
    newPost.save()
            .then((result) => {
                res.status(201).json({
                    message: 'Post added successfully',
                    post: result
                });
            });
}

function updatePost(req, res, next) {
    let newUpload = false;
    if (req.file) {
        newUpload = true;
        const serverPath = req.protocol + '://' + req.get("host");
        req.body.imagePath = serverPath + '/images/' + req.file.filename;
    }

    Post.findOneAndUpdate({ _id: req.params.id, author: req.userId }, req.body)
        .then(result => {
            if (! result) {
                return res.status(400).json({
                    message: 'Unable to update post',
                    post: null
                })
            }
            if (newUpload) {
                // remove old image
                const imagePath = result.imagePath;
                const filename = imagePath.substring(_.lastIndexOf(imagePath, '/') + 1);
                try {
                    fs.unlinkSync('./uploadImages/' + filename);
                } catch(err) {
                    console.error(err);
                }
            }
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
}

function deletePost(req, res, next) {
    Post.findOneAndDelete({_id: req.params.id, author: req.userId })
        .then(result => {
            if (! result) {
                return res.status(400).json({
                    message: 'Unable to delete',
                    post: null
                })
            }
            // remove stored image
            const imagePath = result.imagePath;
            const filename = imagePath.substring(_.lastIndexOf(imagePath, '/') + 1);
            // console.log(filename);
            try {
                fs.unlinkSync('./uploadImages/' + filename);
            } catch(err) {
                console.error(err);
            }

            res.status(200).json({
                message: 'Post deleted successfully'
            })
        }, error => {
            res.status(400).json({
                message: 'Unable to delete',
                post: null
            })
        })
}

module.exports = {
    getPosts,
    getPostById,
    addPost,
    updatePost,
    deletePost
}
