'use strict';

const errors = require('./errors');

module.exports = function rpcDone(done) {

    return {
        success: success,
        error: error,
        badRequest: (message) => error(errors.ERRINT_BAD_REQUEST, message),
        notFound: (message) => error(errors.ERRINT_NOT_FOUND, message),
        notAuthorized: (message) => error(errors.ERRINT_NOT_AUTHORIZED, message),
        forbidden: (message) => error(errors.ERRINT_FORBIDDEN, message),
        notImplemented: (message) => error(errors.ERRINT_NOT_IMPLEMENTED, message),
        notAvailable: (message) => error(errors.ERRINT_NOT_AVAILABLE, message),
        internalError: (message) => error(errors.ERRINT_INTERNAl_ERROR, message)
    }

    // ------------------------------------------------------------------------

    function success(result) {
        done(null, {
            hasError: false,
            result: result
        });
    }

    function error(code, message) {
        done(null, {
            hasError: true,
            code: code,
            message: message || errors.ERRSTR_FAULT_MESSAGE
        });
    }
};
