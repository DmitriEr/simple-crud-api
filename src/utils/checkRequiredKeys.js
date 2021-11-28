const keys = ['name', 'age', 'hobbies'];

const checkRequireMethods = (data, req) => {
    keys.forEach((item) => {
        if (!data[item]) {
            throw new Error(JSON.stringify({ message: `${item} is required`, status: 400 }))
        };
    });
};