'use strict';

const assert = require('assert');
const lib = require('../lib');

describe('fixedConfig', function() {

    var v = lib.fixedConfig({
        name: "Fixed",
        value: {
            "item1": "ITEM 1"
        }
    });
    
    describe('#constructor', function() {
        it('should have "item1" == "ITEM 1"', function() {
            assert.equal("ITEM 1", v.item1);
        });

        it('should have ["item1"] == "ITEM 1"', function() {
            assert.equal("ITEM 1", v["item1"]);
        });
    });

});
