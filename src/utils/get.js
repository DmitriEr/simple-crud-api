const getMethod = (req, persons) => {
    const userId = req.url.match(/[\d\w]{8}-([\d\w]{4}-){3}[\d\w]{12}/);
    if (userId && userId[0]) {
        const user = persons.filter(({ id }) => id === userId[0]);
        if (!user.length) {
            throw new Error(JSON.stringify({ message: 'user not exist', status: 404 }));
        }
        return user[0];
    } else {
        return persons;
    }
}

module.exports = getMethod;