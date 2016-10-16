'use strict';

const assert = require('assert');
const lib = require('../lib');

describe('VerifiableObject', function() {

    var v = lib.verifiableObject({
        item1: "ITEM1",
        "item 2": "ITEM 2",
        item4: 4,
        item5: true,
        item6: false,
        item7: [ 1, "2", true, { f: "v" }, [ 1, 2 ] ],
        item8: {
            item1: "ITEM8 ITEM1"
        },
        "item 9": {
            item1: "ITEM9 ITEM1",
        }
    });

    describe('#construct', function() {

        it('should have value for "item1"', function() {
            assert.equal(v.item1, "ITEM1");
        });

        it('should have value for ["item1"]', function() {
            assert.equal(v["item1"], "ITEM1");
        });

    });

    describe('.ensureMember(path, type)', function() {
        it('should ensure "item1" exists.', function() {
            assert(v.ensureMember("item1"));
        });

        it('should ensure "item1" exists as String.', function() {
            assert(v.ensureMember("item1", String));
        });

        it('should ensure "item 2" exists String.', function() {
            assert(v.ensureMember("item 2", String));
        });

        it('should ensure "item3" does not exist.', function() {
            assert(v.ensureMember("item3", String) === false);
        });

        it('should ensure "item4" does not exist as String.', function() {
            assert(v.ensureMember("item4", String) === false);
        });

        it('should ensure "item4" exists as Number.', function() {
            assert(v.ensureMember("item4", Number));
        });

        it('should ensure "item5" does not exist as String.', function() {
            assert(v.ensureMember("item5", String) === false);
        });

        it('should ensure "item5" does not exist as Number.', function() {
            assert(v.ensureMember("item5", Number) === false);
        });

        it('should ensure "item5" exists as Boolean.', function() {
            assert(v.ensureMember("item5", Boolean));
        });

        it('should ensure "item6" does not exist as String.', function() {
            assert(v.ensureMember("item6", String) === false);
        });

        it('should ensure "item6" does not exist as Number.', function() {
            assert(v.ensureMember("item6", Number) === false);
        });

        it('should ensure "item6" exists as Boolean.', function() {
            assert(v.ensureMember("item6", Boolean));
        });

        it('should ensure "item7" does not exist as String.', function() {
            assert(v.ensureMember("item7", String) === false);
        });

        it('should ensure "item7" does not exist as Number.', function() {
            assert(v.ensureMember("item7", Number) === false);
        });

        it('should ensure "item7" does not exist as Boolean.', function() {
            assert(v.ensureMember("item7", Boolean) === false);
        });

        it('should ensure "item7" exists as Array.', function() {
            assert(v.ensureMember("item7", Array));
        });

        it('should ensure "item8" does not exist as String.', function() {
            assert(v.ensureMember("item8", String) === false);
        });

        it('should ensure "item8" does not exist as Number.', function() {
            assert(v.ensureMember("item8", Number) === false);
        });

        it('should ensure "item8" does not exist as Boolean.', function() {
            assert(v.ensureMember("item8", Boolean) === false);
        });

        it('should ensure "item8" does not exist as Array.', function() {
            assert(v.ensureMember("item8", Array) === false);
        });

        it('should ensure "item8" exists as Object.', function() {
            assert(v.ensureMember("item8", Object));
        });

        it('should ensure "item8.item1" exists as String.', function() {
            assert(v.ensureMember("item8.item1", String));
        });

        it('should ensure "item 9" exists as Object.', function() {
            assert(v.ensureMember("item 9", Object));
        });

        it('should ensure "item 9.item1" exists as String.', function() {
            assert(v.ensureMember("item 9.item1", String));
        });
    });

    describe(".assertMember(path, type)", function() {

        it('should assert that "item1" exists', function() {
            assert.doesNotThrow(() => v.assertMember("item1"));
        });

        it('should assert that "item 2" exists', function() {
            assert.doesNotThrow(() => v.assertMember("item 2"));
        });

        it('should assert that "item3" does not exist', function() {
            assert.throws(() => v.assertMember("item3"));
        });

        it('should assert that "item1" exists as String', function() {
            assert.doesNotThrow(() => v.assertMember("item1", String));
        });

        it('should assert that "item1" does not exist as Number', function() {
            assert.throws(() => v.assertMember("item1", Number));
        });

        it('should assert that "item1" does not exist as Boolean', function() {
            assert.throws(() => v.assertMember("item1", Boolean));
        });

        it('should assert that "item1" does not exist as Array', function() {
            assert.throws(() => v.assertMember("item1", Array));
        });

        it('should assert that "item1" does not exist as Object', function() {
            assert.throws(() => v.assertMember("item1", Object));
        });

        it('should assert that "item4" does not exist as String', function() {
            assert.throws(() => v.assertMember("item4", String));
        });

        it('should assert that "item4" exists as Number', function() {
            assert.doesNotThrow(() => v.assertMember("item4", Number));
        });

        it('should assert that "item4" does not exist as Boolean', function() {
            assert.throws(() => v.assertMember("item4", Boolean));
        });

        it('should assert that "item4" does not exist as Array', function() {
            assert.throws(() => v.assertMember("item4", Array));
        });

        it('should assert that "item4" does not exist as Object', function() {
            assert.throws(() => v.assertMember("item4", Object));
        });

        it('should assert that "item5" does not exist as String', function() {
            assert.throws(() => v.assertMember("item5", String));
        });

        it('should assert that "item5" does not exist as Number', function() {
            assert.throws(() => v.assertMember("item5", Number));
        });

        it('should assert that "item5" exists as Boolean', function() {
            assert.doesNotThrow(() => v.assertMember("item5", Boolean));
        });

        it('should assert that "item5" does not exist as Array', function() {
            assert.throws(() => v.assertMember("item5", Array));
        });

        it('should assert that "item5" does not exist as Object', function() {
            assert.throws(() => v.assertMember("item5", Object));
        });

        it('should assert that "item6" does not exist as String', function() {
            assert.throws(() => v.assertMember("item6", String));
        });

        it('should assert that "item6" does not exist as Number', function() {
            assert.throws(() => v.assertMember("item6", Number));
        });

        it('should assert that "item6" exists as Boolean', function() {
            assert.doesNotThrow(() => v.assertMember("item6", Boolean));
        });

        it('should assert that "item6" does not exist as Array', function() {
            assert.throws(() => v.assertMember("item6", Array));
        });

        it('should assert that "item6" does not exist as Object', function() {
            assert.throws(() => v.assertMember("item6", Object));
        });

        it('should assert that "item7" does not exist as String', function() {
            assert.throws(() => v.assertMember("item7", String));
        });

        it('should assert that "item7" does not exist as Number', function() {
            assert.throws(() => v.assertMember("item7", Number));
        });

        it('should assert that "item7" does not exist as Boolean', function() {
            assert.throws(() => v.assertMember("item7", Boolean));
        });

        it('should assert that "item7" exist as Array', function() {
            assert.doesNotThrow(() => v.assertMember("item7", Array));
        });

        it('should assert that "item7" does not exist as Object', function() {
            assert.throws(() => v.assertMember("item7", Object));
        });

        it('should assert that "item8" does not exist as String', function() {
            assert.throws(() => v.assertMember("item8", String));
        });

        it('should assert that "item8" does not exist as Number', function() {
            assert.throws(() => v.assertMember("item8", Number));
        });

        it('should assert that "item8" does not exist as Boolean', function() {
            assert.throws(() => v.assertMember("item8", Boolean));
        });

        it('should assert that "item8" does not exist as Array', function() {
            assert.throws(() => v.assertMember("item8", Array));
        });

        it('should assert that "item8" exists as Object', function() {
            assert.doesNotThrow(() => v.assertMember("item8", Object));
        });

        it('should assert that "item 9" does not exist as String', function() {
            assert.throws(() => v.assertMember("item 9", String));
        });

        it('should assert that "item 9" does not exist as Number', function() {
            assert.throws(() => v.assertMember("item 9", Number));
        });

        it('should assert that "item 9" does not exist as Boolean', function() {
            assert.throws(() => v.assertMember("item 9", Boolean));
        });

        it('should assert that "item 9" does not exist as Array', function() {
            assert.throws(() => v.assertMember("item 9", Array));
        });

        it('should assert that "item 9" exists as Object', function() {
            assert.doesNotThrow(() => v.assertMember("item 9", Object));
        });

        it('should assert that "item8.item1" exists as String', function() {
            assert.doesNotThrow(() => v.assertMember('item8.item1', String));
        });

        it('should assert that "item 9.item1" exists as String', function() {
            assert.doesNotThrow(() => v.assertMember('item 9.item1', String));
        });

    });
});
