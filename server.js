const http = require('http');
const app = require('./app');

const port = process.env.PORT || 49152;

const server = http.createServer(app);

server.listen(port);