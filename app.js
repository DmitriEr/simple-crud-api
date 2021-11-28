const http = require('http');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config({
    path: `${__dirname}/env/.env.${process.env.NODE_ENV}`,
});

const checkValidPersonId = require('./src/utils/checkValidPersonId');
const checkValidPath = require('./src/utils/checkValidPath');
const deleteMethod = require('./src/utils/delete');
const getMethod = require('./src/utils/get');

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
                const userId = deleteMethod(req, persons);
                persons = persons.filter(({ id }) =>id !== userId);
                res.statusCode = 204;
                res.end();
            }
            break;
            case 'PUT': {
                req.on('data', (data) => {
                    const json = JSON.parse(data.toString());

                    const userId = req.url.match(/[\d\w]{8}-([\d\w]{4}-){3}[\d\w]{12}/);
                
                    if (userId && userId[0]) {
                        const user = persons.filter(({ id }) => id === userId[0]);
                
                        if (!user.length) {
                            res.statusCode = 404;
                            res.end(JSON.stringify({ message: 'user not exist', status: 404 }));
                        }
                        persons = persons.map((item) => {
                            if(item.id === userId[0]) {
                                return { ...item, ...json }
                            }
                            return item;
                        })
                        res.statusCode = 200;
                        res.end(JSON.stringify({ ...user[0], ...json }))
                    }
                })
            }
            break;
            default: {
                const data = getMethod(req, persons);
                res.statusCode = 200;
                res.end(JSON.stringify(data));
            }
        }
    } catch(err) {
        const { message, status } = JSON.parse(err.message);
        res.statusCode = status;
        res.end(JSON.stringify({ detail: message }));
    }
})

server.listen(process.env.PORT, (err) => {
    err ? console.log(err) : console.log(`lisen on ${process.env.PORT} server`);
});