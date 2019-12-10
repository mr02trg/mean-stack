var fs = require('fs');
var _ = require('lodash');

const s3Helper = require('../s3/s3-helper');
const Post = require('../models/post');

function getPosts(req, res, next) {
    
    let query = Post.find();

    // search filter
    if (req.query && req.query.searchInput) {
        const searchRegex = _.join(JSON.parse(req.query.searchInput), '|');
        query.find(
            { $or: [
                { tags: { $regex: searchRegex, $options: 'i'} },
                { title: { $regex: searchRegex, $options: 'i'} },
                { content: { $regex: searchRegex, $options: 'i'} }
            ]}
        )
    }

    // date filter
    if (req.query && req.query.startDate && req.query.endDate) {
        let startDate = new Date(req.query.startDate);
        let endDate = new Date(req.query.endDate);
        query.find(
            { 
                createdDate: {$gte: startDate, $lte: endDate}
            }
        );
    }        
    
    let totalPosts = 0;
    // pagination
    if (req.query) {
        const pageIndex = +req.query.pageIndex;
        const pageSize = +req.query.pageSize;
        query.skip(pageIndex*pageSize).limit(pageSize);
    }

    Post.count().then(postCount => {
        totalPosts = postCount
        return query;
    })
    .then(posts => {
        res.status(200).json({
            message: 'Posts fetched successfully',
            totalPosts: totalPosts,
            posts: posts
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
    // console.log(req.files);
    res.status(200);
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        tags: JSON.parse(req.body.tags),
        documents: _.map(req.files, f => {
            return {fileName: f.originalname, key: f.key}
        }),
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

    //parse uploaded file
    var uploadedKeys = [];
    if (typeof req.body.documents === 'string') {
        var data = JSON.parse(req.body.documents);
        uploadedKeys.push(data ? data.key : null);
    }
    else {
        uploadedKeys = _.map(req.body.documents, i => {
            var data = JSON.parse(i);
            return data ? data.key : null
        });    
    }
    const newUploads = _.map(req.files, f => { return {fileName: f.originalname, key: f.key}});
    let removedUploads = [];

    // parse tags
    var newTags = [];
    if (typeof req.body.tags === 'string') {
        newTags = JSON.parse(req.body.tags);;
    }
    else {
        newTags = req.body.tags;
    }

    let updatedPost = {};
    Post.findOneAndUpdate({ _id: req.params.id, author: req.userId }, 
        {   
            $pull: {
                documents: {  key: { $nin: uploadedKeys }  },
                tags: { $nin: newTags }
            },
            $set: 
            {
                title: req.body.title,
                content: req.body.content
            },
        },
        { "new": false}
    )
    .then( result => {
        removedUploads = _.filter(result.documents, x => ! uploadedKeys.includes(x.key));
        newTags = _.filter(newTags, x => ! result.tags.includes(x));
        return Post.findOneAndUpdate({ _id: req.params.id, author: req.userId }, 
            {
                $push: 
                {
                    documents: { $each: newUploads },
                    tags: { $each: newTags }
                },
            },
            { "new": true}
        );
    })
    .then(result => {
        updatedPost = result;
        if (removedUploads.length > 0)
            return s3Helper.deleteDocuments(removedUploads);
    })
    .then( result => {
        res.status(200).json({
            message: 'Post update successfully',
            post: updatedPost
        })
    })
    .catch( err => {
        console.error(err);
        return res.status(400).json({
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
                    message: 'Bad Request',
                    post: null
                })
            }
            if (result.documents && result.documents.length > 0)
                return s3Helper.deleteDocuments(result.documents)
        })
        .then( success => {
            res.status(200).json({
                message: 'Post deleted successfully'
            })
        })
        .catch(err => {
            console.error(err);
            res.status(400).json({
                message: 'Bad request'
            })
        })
}

function downloadPostDocument(req, res, next) {
    var postId = req.params.id;
    var key = req.body.key;

    if (key) {
        s3Helper.getDocumentByKey(key)
                .then(result => {
                    return res.status(200).json({
                        message: "Retrieve document successfully",
                        response: result
                    });
                }, err => {
                    console.error(err);
                    return res.status(400).json({
                        message: "Bad Request"
                    });
                });
    }
    else {
        Post.findById(postId)
        .then(post => {
            var promises = [];
            _.forEach(post.documents, doc => {
                promises.push(s3Helper.getDocumentByKey(doc.key));
            });

            return Promise.all(promises);
        })
        .then(result => {
            return res.status(200).json({
                message: "Retrieve documents successfully",
                response: result
            })
        })
        .catch(err => {
            return res.status(400).json({
                message: "Bad Request"
            })
        });
    }
}

module.exports = {
    getPosts,
    getPostById,
    addPost,
    updatePost,
    deletePost,
    downloadPostDocument
}
