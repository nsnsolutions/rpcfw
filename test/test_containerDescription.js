'use strict';

const assert = require('assert');
const lib = require('../lib');

describe('containerDescription', function() {

    describe('#constructor', function() {

        var v = lib.containerDescription({
            registry: "abc123",
            image: "xyz789"
        });
    
        it('should have "registry" == "abcd123"', function() {
            assert.equal("abc123", v.registry);
        });

        it('should have "image" == "xyz789"', function() {
            assert.equal("xyz789", v.image);
        });
    });

    describe('.toString()', function() {

        it('should have toString() == "xyz789"', function() {

            var v = lib.containerDescription({
                image: "xyz789"
            });

            assert.equal("xyz789", v.toString());
        });

        it('should have toString() == "abc123/xyz789"', function() {

            var v = lib.containerDescription({
                registry: "abc123",
                image: "xyz789"
            });

            assert.equal("abc123/xyz789", v.toString());
        });

        it('should have toString() == "abc123/xyz789:456"', function() {

            var v = lib.containerDescription({
                registry: "abc123",
                image: "xyz789"
            });

            assert.equal("abc123/xyz789:456", v.toString('456'));
        });

    });

    describe('.isValid', function() {

        it('should be valid with registry and image.', function() {
            var v = lib.containerDescription({
                registry: "abc123",
                image: "xyz789"
            });
    
            assert(v.isValid());
        });

        it('should be valid with image only.', function() {
            var v = lib.containerDescription({
                image: "xyz789"
            });
    
            assert(v.isValid());
        });

        it('should be invalid with out registry or image.', function() {
            var v = lib.containerDescription({ });
    
            assert(!v.isValid());
        });

        it('should be invalid with registry only.', function() {
            var v = lib.containerDescription({ 
                registry: "abc123"
            });
    
            assert(!v.isValid());
        });
    });

});
