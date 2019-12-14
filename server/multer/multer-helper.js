const AWS = require('aws-sdk');
const multer = require('multer')
const multerS3 = require('multer-s3')
require('dotenv').config()


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

var s3 = new AWS.S3({ /* ... */ })
 
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'application/pdf': 'pdf',
}

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname, mime: file.mimetype, originalname: file.originalname});
    },
    key: function (req, file, cb) {
      const fileName =  Date.now() + '_' + file.originalname.split(' ').join('-') ;
      const path = `user_${req.userId}/` + fileName;
      cb(null, path)
    }
  })
})
 
module.exports = upload;
