const { v4: uuidv4 } = require('uuid');

const keys = ['name', 'age', 'hobbies'];

const checkRequireMethods = (data) => {
    keys.forEach((item) => {
        if (!data[item]) {
            throw new Error(JSON.stringify({ message: `${item} is required`, status: 400 }))
        };
    });
};

const post = (data, req) => {
    const json = JSON.parse(data.toString());
    
    checkRequireMethods(json);

    if (!/\/person(\/)?$/.test(req.url)) {
        throw new Error('invalid path');
    }
                    
    return { ...json, id: uuidv4() };
}

module.exports = post;