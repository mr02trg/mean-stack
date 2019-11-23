
var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var router = express.Router();

const securityHandler = require('../middleware/security-handler');
const Post = require('../models/post');

// multer configuration
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
    // specify where to save the file
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "./uploadImages");
    },
    // construct file name
    filename: (req, file, cb) => {
        const name = path.parse(file.originalname).name.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

// register security middlewares
// router.use(securityHandler);

router.get('', (req, res, next) => {
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
})

router.get('/:id', securityHandler, (req, res, next) => {
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

router.post('', securityHandler, multer({storage: storage}).single("image"), (req, res, next) => {
    const serverPath = req.protocol + '://' + req.get("host");
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: serverPath + '/images/' + req.file.filename
    });

    // save to db
    newPost.save()
            .then((result) => {
                res.status(201).json({
                    message: 'Post added successfully',
                    post: result
                });
            });
});

router.put('/:id', securityHandler, multer({storage: storage}).single("image"), (req, res, next) => {

    let newUpload = false;
    if (req.file) {
        newUpload = true;
        const serverPath = req.protocol + '://' + req.get("host");
        req.body.imagePath = serverPath + '/images/' + req.file.filename;
    }

    Post.findByIdAndUpdate(req.params.id, req.body)
        .then(result => {
            console.log(result);
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
});

router.delete('/:id', securityHandler, (req, res, next) => {
    Post.findOneAndDelete({_id: req.params.id})
        .then(result => {
            // remove stored image
            const imagePath = result.imagePath;
            const filename = imagePath.substring(_.lastIndexOf(imagePath, '/') + 1);
            // console.log(filename);
            try {
                fs.unlinkSync('./uploadImages/' + filename);
            } catch(err) {
                console.error(err);
            }
        })
    res.status(200).json({
        message: 'Post deleted successfully'
    })
});

module.exports = router;