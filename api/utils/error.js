export const errorHandler = (statusCode, message, errors = null) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    if (errors) {
        error.errors = errors;
    }
    return error;
};