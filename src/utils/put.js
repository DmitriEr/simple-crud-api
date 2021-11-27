const putMethod = (data, req, persons) => {
    const json = JSON.parse(data.toString());
    
    if (!/\/person\/[\d\w]{8}-([\d\w]{4}-){3}[\d\w]{12}(\/)?$/.test(req.url)) {
        throw new Error('invalid path');
    }

    const userId = req.url.match(/[\d\w]{8}-([\d\w]{4}-){3}[\d\w]{12}/);

    if (userId) {
        const user = persons.filter(({ id }) => id === userId[0]);

        if (!user.length) {
            throw new Error(JSON.stringify({ message: 'user not exist', status: 404 }));
        }
        return { ...user[0], ...json };
    }
}

module.exports = putMethod;