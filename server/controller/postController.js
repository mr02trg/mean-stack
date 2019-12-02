
var express = require('express');
var multer = require('multer');
var path = require('path');


var router = express.Router();

const securityHandler = require('../middleware/security-handler');
const postService =  require('../service/postService');

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

router.get('', postService.getPosts);

router.get('/:id', securityHandler, postService.getPostById);

router.post('', securityHandler, multer({storage: storage}).single("image"), postService.addPost);

router.put('/:id', securityHandler, multer({storage: storage}).single("image"), postService.updatePost);

router.delete('/:id', securityHandler, postService.deletePost);

module.exports = router;