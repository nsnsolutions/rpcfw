'use strict';

const assert = require('assert');
const rpcDone = require('../lib/rpcDone');
const errors = require('../lib/errors');

describe('rpcDown', function() {

    function getCallback(code) {
        function cbCode(err, data) {
            assert.equal(code, data.code);
        }
        return cbCode;
    }

    function cbHasErrorMessage(err, data) {
        assert.equal("abc123", data.errorMessage);
    }

    function cbHasError(err, data) {
        assert(data.hasError);
    }

    function cbResult(err, data) {
        assert.equal("OK", data.result);
    }

    function cbNotHasError(err, data) {
        assert(!data.hasError);
    }

    describe('.success', function() {

        it('should have result "OK"', function() {
            rpcDone(cbResult).success("OK");
        });

        it('should have false value for hasError', function() {
            rpcDone(cbNotHasError).success("OK");
        });

    });

    describe('.error', function() {

        it('should have code 123', function() {
            rpcDone(getCallback(123)).error(123, "abc123");
        });

        it('should have errorMessage abc123123', function() {
            rpcDone(cbHasErrorMessage).error(123, "abc123");
        });

        it('should have true value for hasError', function() {
            rpcDone(cbHasError).error(123, "abc123");
        });

    });

    describe('.badRequest', function() {
        it('should have code ERRINT_BAD_REQUEST', function() {
            rpcDone(getCallback(errors.ERRINT_BAD_REQUEST)).badRequest("abc123");
        });

        it('should have errorMessage "abc123"', function() {
            rpcDone(cbHasErrorMessage).badRequest("abc123");
        });

        it('should have true in hasError', function() {
            rpcDone(cbHasError).badRequest("abc123");
        });
    });

    describe('.notAuthorized', function() {
        it('should have code ERRINT_NOT_AUTHORIZED', function() {
            rpcDone(getCallback(errors.ERRINT_NOT_AUTHORIZED)).notAuthorized("abc123");
        });

        it('should have errorMessage "abc123"', function() {
            rpcDone(cbHasErrorMessage).notAuthorized("abc123");
        });

        it('should have true in hasError', function() {
            rpcDone(cbHasError).notAuthorized("abc123");
        });
    });

    describe('.forbidden', function() {
        it('should have code ERRINT_FORBIDDEN', function() {
            rpcDone(getCallback(errors.ERRINT_FORBIDDEN)).forbidden("abc123");
        });

        it('should have errorMessage "abc123"', function() {
            rpcDone(cbHasErrorMessage).forbidden("abc123");
        });

        it('should have true in hasError', function() {
            rpcDone(cbHasError).forbidden("abc123");
        });
    });

    describe('.notImplemented', function() {
        it('should have code ERRINT_NOT_IMPLEMENTED', function() {
            rpcDone(getCallback(errors.ERRINT_NOT_IMPLEMENTED)).notImplemented("abc123");
        });

        it('should have errorMessage "abc123"', function() {
            rpcDone(cbHasErrorMessage).notImplemented("abc123");
        });

        it('should have true in hasError', function() {
            rpcDone(cbHasError).notImplemented("abc123");
        });
    });

    describe('.notAvailable', function() {
        it('should have code ERRINT_NOT_AVAILABLE', function() {
            rpcDone(getCallback(errors.ERRINT_NOT_AVAILABLE)).notAvailable("abc123");
        });

        it('should have errorMessage "abc123"', function() {
            rpcDone(cbHasErrorMessage).notAvailable("abc123");
        });

        it('should have true in hasError', function() {
            rpcDone(cbHasError).notAvailable("abc123");
        });
    });

    describe('.internalError', function() {
        it('should have code ERRINT_INTERNAl_ERROR', function() {
            rpcDone(getCallback(errors.ERRINT_INTERNAl_ERROR)).internalError("abc123");
        });

        it('should have errorMessage "abc123"', function() {
            rpcDone(cbHasErrorMessage).internalError("abc123");
        });

        it('should have true in hasError', function() {
            rpcDone(cbHasError).internalError("abc123");
        });
    });

});
