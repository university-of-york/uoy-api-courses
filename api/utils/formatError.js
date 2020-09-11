module.exports = (message, status, error, path) => {
    return {
        statusCode: status,
        body: JSON.stringify({
            timestamp: new Date().toISOString(),
            status: status,
            error: error,
            message: message,
            path: path
        })
    }
}
