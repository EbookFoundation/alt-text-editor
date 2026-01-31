import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const hostname = '127.0.0.1';
const port = 8080;

const server = createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './' || req.url.startsWith('/iframe')) {
        filePath = './index.html'; // Default to serving index.html
    }
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    if(extname === ".jpg") { //if image change type
        contentType = 'image/jpeg';
    }
    //read file and write to server
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404 Not Found');
            } else {
                // Server error
                res.writeHead(500);
                res.end('Server Error: ' + err.code);
            }
        } else {
            // Successfully read the file
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});