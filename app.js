const http = require('http');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config({
    path: `${__dirname}/env/.env.${process.env.NODE_ENV}`,
});

const checkValidPersonId = require('./src/utils/checkValidPersonId');
const checkValidPath = require('./src/utils/checkValidPath');

let persons = [];

const server = http.createServer((req, res) => {
    try {
        checkValidPath(req);
        checkValidPersonId(req);

        switch(req.method) {
            case 'POST': {
                req.on('data', (data) => {
                    const json = JSON.parse(data.toString());
                    if (json.name && json.age && json.hobbies && Object.keys(json).length === 3) {
                        const user = { ...json, id: uuidv4() };
                        persons.push(user);
                        res.statusCode = 201;
                        res.end(JSON.stringify(user));
                    } else {
                        res.statusCode = 400;
                        if (Object.keys(json).length > 3) {
                            res.end(JSON.stringify({ detail: 'user is need three params' }));
                        };
                        ['name', 'age', 'hobbies'].forEach((item) => {
                            if (!json[item]) {
                                res.end(JSON.stringify({ detail: `${item} is required` }));
                            }
                        })
                    }
                });
            }
            break;
            case 'DELETE': {
                const userId = req.url.match(/[\d\w]{8}-([\d\w]{4}-){3}[\d\w]{12}/);
                if (userId && userId[0]) {
                    const user = persons.filter(({ id }) => id === userId[0]);
                    if (!user.length) {
                        res.statusCode = 404;
                        res.end(JSON.stringify({ detail: 'user not exist' }));
                    } else {
                        persons = persons.filter((item) => item.id !== userId[0]);
                        res.statusCode = 204;
                        res.end();
                    }
                }
            }
            break;
            case 'PUT': {
                req.on('data', (data) => {
                    const json = JSON.parse(data.toString());
                    const keys = Object.keys(json);

                    const isExistKey = keys.reduce((acc, prev) => {
                        if (!['name', 'age', 'hobbies'].includes(prev)) {
                            acc = false;
                            return acc;
                        }
                        return acc;
                    }, true);

                    const userId = req.url.match(/[\d\w]{8}-([\d\w]{4}-){3}[\d\w]{12}/);
                
                    if (isExistKey && userId && userId[0]) {
                        const user = persons.filter(({ id }) => id === userId[0]);
                
                        if (!user.length) {
                            res.statusCode = 404;
                            res.end(JSON.stringify({ detail: 'user not exist' }));
                        } else {
                            persons = persons.map((item) => {
                                if(item.id === userId[0]) {
                                    return { ...item, ...json }
                                }
                                return item;
                            })
                            res.statusCode = 200;
                            res.end(JSON.stringify({ ...user[0], ...json }));
                        }
                    } else {
                        res.statusCode = 400;
                        res.end(JSON.stringify({ detail: 'key is not exist' }))
                    }
                })
            }
            break;
            default: {
                const userId = req.url.match(/[\d\w]{8}-([\d\w]{4}-){3}[\d\w]{12}/);
                if (userId && userId[0]) {
                    const user = persons.filter(({ id }) => id === userId[0]);
                    if (!user.length) {
                        res.statusCode = 404;
                        res.end(JSON.stringify({ detail: 'user not exist' }));
                    } else {
                        res.statusCode = 200;
                        res.end(JSON.stringify(user[0]))
                    }
                } else {
                    res.statusCode = 200;
                    res.end(JSON.stringify(persons));
                }
            }
        }
    } catch(err) {
        if (/{"message":"(.)*","status":([0-9]){3}}/.test(err.message)) {
            const { message, status } = JSON.parse(err.message);
            res.statusCode = status;
            res.end(JSON.stringify({ detail: message }));
        } else {
            res.statusCode = 500;
            res.end(JSON.stringify({ detail: 'internal server error'}));
        }
    }
})

server.listen(process.env.PORT, (err) => {
    err ? console.log(err) : console.log(`lisen on ${process.env.PORT} server`);
});