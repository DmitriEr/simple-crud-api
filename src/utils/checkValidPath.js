const detailError = JSON.stringify({ message: 'path not exist', status: 404 });

const checkValidPersonId = (req) => {
    const isExistPersonPath = /\/person(\/)?$/.test(req.url)
    const isPOST = /POST/.test(req.method);
    
    const isPutDelete = /(PUT|DELETE)/.test(req.method);
    const isExistIdPath = /\/person\/([0-9a-zA-Z-]*)?(\/)?$/.test(req.url);

    const isGet = /GET/.test(req.method);
    
    if ((isPOST && !isExistPersonPath) || (!isExistIdPath && (isGet || isPutDelete))) {
        throw new Error(detailError);
    }
}

module.exports = checkValidPersonId;