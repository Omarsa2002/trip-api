

const sendResponse = (res, status, message = '', data = any, errors = []) => {
    let errList = [];
    if (typeof errors === 'object' && errors.message) {
        errList.push({ message: errors.message, key: null });
    }
    if (typeof errors === 'string') {
        errList.push({ message: errors, key: null });
    }
    return res.status(status).json({
        success: !(status > 300),
        message,
        data,
        errors: errList.length ? errList : errors,
    });
};
module.exports.sendResponse = sendResponse;

