const http = require('http');

const checkValidPersonId = require('./src/utils/checkValidPersonId');
const post = require('./src/utils/post');
const deleteMethod = require('./src/utils/delete');
const getMethod = require('./src/utils/get');
const putMethod = require('./src/utils/put');

let persons = [];

const server = http.createServer((req, res) => {
    try {
        checkValidPersonId(req);

        switch(req.method) {
            case 'POST': {
                req.on('data', (data) => {
                    const user = post(data, req);
                    persons.push(user);
                    res.statusCode = 201;
                    res.end(JSON.stringify(persons));
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
                    const user = putMethod(data, req, persons);
                    persons = persons.filter((item) => {
                        if (item.id === user.id) {
                            return user;
                        }
                        return item;
                    });
                    res.statusCode = 200;
                    res.end(JSON.stringify(user));
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

server.listen(3000, 'localhost', (err) => {
    err ? console.log(err) : console.log(`lisen on 3000 server`);
});