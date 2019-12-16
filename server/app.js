// const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const express_app = require('./server');
require('dotenv').config()


const options = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'localhost.crt'))
};

const port = process.env.PORT || 3000;
const server = https.createServer(options, express_app);

// start the server
server.listen(port);