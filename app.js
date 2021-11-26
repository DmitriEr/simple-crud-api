const http = require('http');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, 'db', 'database.txt');

let persons = [];

fs.readFile(dataPath, 'utf-8', (err, data) => {
    persons = JSON.parse(data.toString());
});

const server = http.createServer((req, res) => {
    switch(req.method) {
        case 'POST':
            let requestData = {};
            let statusCode = 201;
            req.on('data', (data) => {
                try {
                    const json = JSON.parse(data.toString());
                    if (!json.name) {
                        throw new Error('name is required');
                    }
                    if (!json.age) {
                        throw new Error('age is required');
                    }
                    if (!json.hobbies) {
                        throw new Error('hobbies is required');
                    }
                    if (!/\/person\//.test(req.url)) {
                        throw new Error('invalid path');
                    }
                    requestData = { ...json, id: uuidv4() };
                    persons.push(requestData);
                } catch(err) {
                    requestData = { detail: err.message };
                    statusCode = 400;
                }
            })
            req.on('end', () => {
                res.statusCode = statusCode;
                res.end(JSON.stringify(requestData));
            })
            break;
        case 'DELETE': {
            let statusCode = 204;
            req.on('data', () => {
                    const [id] = req.url.match(/[\d\w]{8}-([\d\w]{4}-){3}[\d\w]{12}/);
                    if (id) {
                        const [user] = persons.filter((item) => item.id === id); 
                        if (!user) {
                            statusCode = 404;
                        } else {
                            persons = persons.filter((item) => item.id !== id);
                        }
                    }
            })
            req.on('end', () => {
                res.statusCode = statusCode;
                res.end();
            });
        }
            break;
        case 'PUT':
            res.statusCode = 200;
            break;
        case 'DELETE':
            res.statusCode = 200;
            break
        default: {
            let statusCode = 200;
            let requestData = persons;
            if (!/\/person(\/)?([\d\w]{8}-([\d\w]{4}-){3}[\d\w]{12})?(\/)?/.test(req.url)) {
                statusCode = 400;
                requestData = { detail: 'invalid path'}
            } else {
                if (/[\d\w]{8}-([\d\w]{4}-){3}[\d\w]{12}(\/)?/.test(req.url)) {
                    const [id] = req.url.match(/[\d\w]{8}-([\d\w]{4}-){3}[\d\w]{12}/);
                    const [user] = persons.filter((data) => data.id === id);
                    if (!user) {
                        statusCode = 404;
                        requestData = { detail: 'user not exist'}
                    } else {
                        statusCode = 200;
                        requestData = user;
                    }
                } else {
                    statusCode = 201;
                    requestData = persons;
                }
            }
            req.on('data', (data) => {})
            req.on('end', () => {
                res.statusCode = statusCode;
                res.end(JSON.stringify(requestData));
            })
        }
    }
})

server.listen(3000, 'localhost', (err) => {
    err ? console.log(err) : console.log(`lisen on 3000 server`);
});