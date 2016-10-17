'use strict';

const assert = require('assert');
const lib = require('../lib');

describe('serviceDescription', function() {

    var v = lib.serviceDescription({
        name: "MyService",
        description: "This is a service.",
        version: "1.2.3"
    });
    
    describe('#constructor', function() {
        it('should have "name" == "MyService"', function() {
            assert.equal("MyService", v.name);
        });

        it('should have "description" == "This is a service."', function() {
            assert.equal("This is a service.", v.description);
        });
    });

    describe('.version', function() {
        it('should have "version.major" == 1', function() {
            assert.strictEqual(1, v.version.major);
        });

        it('should have "version.minor" == 2', function() {
            assert.strictEqual(2, v.version.minor);
        });

        it('should have "version.patch" == 3', function() {
            assert.strictEqual(3, v.version.patch);
        });

        it('should have version.toString() == "1.2.3"', function() {
            assert.equal("1.2.3", v.version.toString());
        });
    });

    describe('.isValid()', function() {
    
        it('should be valid with name, description and version.', function() {
            var v = lib.serviceDescription({
                name: "MyService",
                description: "This is a service.",
                version: "1.2.3"
            });
            assert(v.isValid());
        });
    
        it('should be valid with name and version.', function() {
            var v = lib.serviceDescription({
                name: "MyService",
                version: "1.2.3"
            });
            assert(v.isValid());
        });
    
        it('should be invalid with without name', function() {
            var v = lib.serviceDescription({
                description: "This is a service.",
                version: "1.2.3"
            });
            assert(!v.isValid());
        });
    
        it('should be invalid with without version', function() {
            var v = lib.serviceDescription({
                name: "MyService",
                description: "This is a service.",
            });
            assert(!v.isValid());
        });
    });

    describe('.toString', function() {
        it('should have toString() == "MyService v1.2.3', function() {
            var v = lib.serviceDescription({
                name: "MyService",
                description: "This is a service.",
                version: "1.2.3"
            });
    
            assert.equal("MyService v1.2.3", v.toString());
        });
    });

});
