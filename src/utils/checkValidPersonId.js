const detailError = JSON.stringify({ message: 'invalid person id', status: 400 });

const checkValidPersonId = (req) => {
    const id = req.url.match(/\/[\d\w]{8}-([\d\w]{4}-){3}[\d\w]{12}(\/|$)/);
    const isGetAllUsers = /\/person(\/)?$/.test(req.url);
    const isGetMethod = /GET/.test(req.method);
    const isPutDeleteMethod = /(DELETE|PUT)/.test(req.method);

    if (!id && (isPutDeleteMethod || (!isGetAllUsers && isGetMethod))) {
        throw new Error(detailError);
    }
}

module.exports = checkValidPersonId;