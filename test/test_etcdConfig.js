'use strict';

const Etcd = require('node-etcd');
const assert = require('assert');
const lib = require('../lib');

var etcd, etcdKey;

if(process.env.SERVICE_DISCOVERY_TEST_KEY) {
    etcd = new Etcd(process.env.SERVICE_DISCOVERY_URI);
    etcdKey = process.env.SERVICE_DISCOVERY_TEST_KEY;
    describe('etcdConfig', test_etcdConfig);
} else {
    console.warn("Will skip etcdConfig tests.");
    console.warn("If you wish to run them, please export the following envs.");
    console.warn(" - SERVICE_DISCOVERY_URI");
    console.warn(" - SERVICE_DISCOVERY_TEST_KEY");
    describe.skip('etcdConfig', test_etcdConfig);
}

function test_etcdConfig() {

    var v;
    if(etcd) {
        etcd.setSync(etcdKey + "/item1", "ITEM1");
        etcd.setSync(etcdKey + "/item2", 2);
        etcd.setSync(etcdKey + "/item3/item1", "ITEM3.1");

        v = lib.etcdConfig({
            name: "Test",
            key: etcdKey,
            watch: false
        }, { etcd: etcd });
    }

    describe('#constructor', function() {
        it('should contain "item1"', function() {
            assert.equal(v.item1, "ITEM1");
        });

        it('should contain "item3.item1"', function() {
            assert.equal(v.item3.item1, "ITEM3.1");
        });
    });

};
