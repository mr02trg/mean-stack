

var express = require('express');
var router = express.Router();

const postService =  require('../service/postService');

router.get('/annoucement', postService.getAnnoucement);

module.exports = router;