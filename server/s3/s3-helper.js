const aws = require('aws-sdk');
const _ = require('lodash');

const s3 = new aws.S3(); // Pass in opts to S3 if necessary
require('dotenv').config()


function getDocumentByKey(key) {
    var options = {
        Bucket: process.env.BUCKET_NAME,
        Key: key
    }
    
    return new Promise(function(resolve, reject) {
        s3.getObject(options, function(err, data) {
            // Handle any error and exit
            if (err)
                reject(err);
            else
                resolve(data);
        });
    })   
}


function deleteDocuments(documents) {
    return new Promise(function(resolve, reject) {
        const options = {
            Bucket: process.env.BUCKET_NAME,
            Delete: {
                Objects: _.map(documents, doc => {
                    return {Key : doc.key}
                })
            }
        }

        s3.deleteObjects(options, function(err, data) {
            if (err) {
                reject(err)
            }
            else {
                resolve(data)
            }
        });
    })
}

module.exports = {
    getDocumentByKey, 
    deleteDocuments
}