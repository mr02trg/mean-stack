const mongoose = require('mongoose');

// create schema
const postSchema = mongoose.Schema({
    title: { type: String, required: true},
    content: { type: String, required: true},
    tags: [String],
    documents: [{ fileName: { type: String, required: true }, key: { type: String, required: true } }],
    createdDate: { type: Date, default: Date.now },
    author: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true }
});

module.exports = mongoose.model('Post', postSchema);