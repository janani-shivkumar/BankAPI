const http = require('http');
const app = require('./app');

const port = process.env.PORT || 5005;

process.env.PLIMIT = 0;
process.env.POFFSET = 0;

const server = http.createServer(app);

server.listen(port);