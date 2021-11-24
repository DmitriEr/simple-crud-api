const http = require('http');
const { v4: uuidv4 } = require('uuid');

const persons = [];

const checkData = (data, url, method) => {
    const { name, age, hobbies } = data;
    if (!name) {
        throw new Error('name is required');
    }
    if (!age) {
        throw new Error('age is required');
    }
    if (!hobbies) {
        throw new Error('hobbies is required');
    }
    if (!/\/person\//.test(url) && (method === 'POST')) {
        throw new Error('invalid path');
    }
}

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
        case 'DELETE':
            res.statusCode = 200;
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
                    // const isUserExist = persons.filter((data) => data.id === id);
                    // if (!isUserExist) {
                    //     statusCode = 404;
                    //     requestData = { detail: 'user not exist'}
                    // } else {
                    //     statusCode = 200;
                    //     requestData = { isUserExist };
                    // }
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