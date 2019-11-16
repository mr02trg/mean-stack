const http = require('http');
const express_app = require('./server');


const port = process.env.PORT || 3000;
const server = http.createServer(express_app);

// start the server
server.listen(port);