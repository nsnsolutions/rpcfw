'use strict';

const Etcd = require('./mock_etcd.js');
const assert = require('assert');
const lib = require('../lib');

var etcd = new Etcd(process.env.SERVICE_DISCOVERY_URI);

describe('etcdConfig', function test_etcdConfig() {

    describe('#data', function() {
        var v = lib.etcdConfig({
            name: "Test",
            key: "/tests/rpcfw/ut",
            watch: false
        }, etcd);

        it('should contain "item1"', function() {
            assert.equal(v.item1, "ITEM1");
        });

        it('should contain "item3.item1"', function() {
            assert.equal(v.item3.item1, "ITEM3.1");
        });
    });

    describe.skip('#onUpdate', function() {
        // I cannot figure out how to test this.
        var v = lib.etcdConfig({
            name: "Test",
            key: "/tests/rpcfw/ut",
            watch: true
        }, etcd);

        it('should contain "item1"', function() {
            assert.equal(v.item1, "ITEM1");
        });

        it('should contain "item3.item1"', function() {
            assert.equal(v.item3.item1, "ITEM3.1");
        });
    });

});

