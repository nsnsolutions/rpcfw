'use strict';

const assert = require('assert');
const lib = require('../lib');

describe('errors', function() {

    describe('ERRINT_BAD_REQUEST', function() {
        it('should have ERRINT_BAD_REQUEST', function() {
            assert.equal(0xFFFF0000 + 1, lib.errors.ERRINT_BAD_REQUEST);
        });

        it('should find ERRINT_BAD_REQUEST', function() {
            assert.equal(lib.errors.lookup(0xFFFF0000 + 1), "ERRINT_BAD_REQUEST");
        });

        it('should recognize ERRINT_BAD_REQUEST as a builtin error.', function() {
            assert(lib.errors.isBuiltin(0xFFFF0000 + 1));
        });

        it('should not recognize ERRINT_BAD_REQUEST - 0xFFFF0000 as a builtin error.', function() {
            assert(!lib.errors.isBuiltin(1));
        });
    });

    describe('ERRINT_UNAUTHORIZED', function() {
        it('should have ERRINT_UNAUTHORIZED', function() {
            assert.equal(0xFFFF0000 + 2, lib.errors.ERRINT_UNAUTHORIZED);
        });

        it('should find ERRINT_UNAUTHORIZED', function() {
            assert.equal(lib.errors.lookup(0xFFFF0000 + 2), "ERRINT_UNAUTHORIZED");
        });

        it('should recognize ERRINT_UNAUTHORIZED as a builtin error.', function() {
            assert(lib.errors.isBuiltin(0xFFFF0000 + 2));
        });

        it('should not recognize ERRINT_UNAUTHORIZED - 0xFFFF0000 as a builtin error.', function() {
            assert(!lib.errors.isBuiltin(2));
        });
    });

    describe('ERRINT_FORBIDDEN', function() {
        it('should have ERRINT_FORBIDDEN', function() {
            assert.equal(0xFFFF0000 + 3, lib.errors.ERRINT_FORBIDDEN);
        });

        it('should find ERRINT_FORBIDDEN', function() {
            assert.equal(lib.errors.lookup(0xFFFF0000 + 3), "ERRINT_FORBIDDEN");
        });

        it('should recognize ERRINT_FORBIDDEN as a builtin error.', function() {
            assert(lib.errors.isBuiltin(0xFFFF0000 + 3));
        });

        it('should not recognize ERRINT_FORBIDDEN - 0xFFFF0000 as a builtin error.', function() {
            assert(!lib.errors.isBuiltin(3));
        });
    });

    describe('ERRINT_NOT_IMPLEMENTED', function() {
        it('should have ERRINT_NOT_IMPLEMENTED', function() {
            assert.equal(0xFFFF0000 + 4, lib.errors.ERRINT_NOT_IMPLEMENTED);
        });

        it('should find ERRINT_NOT_IMPLEMENTED', function() {
            assert.equal(lib.errors.lookup(0xFFFF0000 + 4), "ERRINT_NOT_IMPLEMENTED");
        });

        it('should recognize ERRINT_NOT_IMPLEMENTED as a builtin error.', function() {
            assert(lib.errors.isBuiltin(0xFFFF0000 + 4));
        });

        it('should not recognize ERRINT_NOT_IMPLEMENTED - 0xFFFF0000 as a builtin error.', function() {
            assert(!lib.errors.isBuiltin(4));
        });
    });

    describe('ERRINT_NOT_AVAILABLE', function() {
        it('should have ERRINT_NOT_AVAILABLE', function() {
            assert.equal(0xFFFF0000 + 5, lib.errors.ERRINT_NOT_AVAILABLE);
        });

        it('should find ERRINT_NOT_AVAILABLE', function() {
            assert.equal(lib.errors.lookup(0xFFFF0000 + 5), "ERRINT_NOT_AVAILABLE");
        });

        it('should recognize ERRINT_NOT_AVAILABLE as a builtin error.', function() {
            assert(lib.errors.isBuiltin(0xFFFF0000 + 5));
        });

        it('should not recognize ERRINT_NOT_AVAILABLE - 0xFFFF0000 as a builtin error.', function() {
            assert(!lib.errors.isBuiltin(5));
        });
    });

    describe('ERRINT_INTERNAl_ERROR', function() {
        it('should have ERRINT_INTERNAl_ERROR', function() {
            assert.equal(0xFFFF0000 + 6, lib.errors.ERRINT_INTERNAl_ERROR);
        });

        it('should find ERRINT_INTERNAl_ERROR', function() {
            assert.equal(lib.errors.lookup(0xFFFF0000 + 6), "ERRINT_INTERNAl_ERROR");
        });

        it('should recognize ERRINT_INTERNAl_ERROR as a builtin error.', function() {
            assert(lib.errors.isBuiltin(0xFFFF0000 + 6));
        });

        it('should not recognize ERRINT_INTERNAl_ERROR - 0xFFFF0000 as a builtin error.', function() {
            assert(!lib.errors.isBuiltin(6));
        });
    });

});
