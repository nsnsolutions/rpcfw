'use strict';

const assert = require('assert');
const fs = require('fs');
const temp = require('temp');
const lib = require('../lib');
const Etcd = require('./mock_etcd');

describe('serviceConfiguration', function() {

    var etcd = new Etcd();

    describe('#constructor(obj)', function() {
        var v = lib.serviceConfiguration({
            name: "MyService",
            version: "1.2.3",
            description: "This is a service",
            main: `${__dirname}/index.js`,
            discoveryUri: "etcd-discovery.local",
            configurations: [
                { name: "test1", value: { item1: "ITEM 1" } },
                { name: "test2", key: "/tests/rpcfw/ut" },
            ],
            container: {
                registry: "abc123",
                image: "xyz789"
            }
        }, { etcd: etcd });

        it('should have serviceDescription', function() {
            assert(v.serviceDescription.isValid());
        });

        it('should have containerDescription', function() {
            assert(v.containerDescription.isValid());
        });

        it('should have configurations', function() {
            assert.equal(v.configurations.test1.item1, "ITEM 1");
            assert.equal(v.configurations.test2.item3.item1, "ITEM3.1");
        });
    });

    describe('.isValid', function() {
        it('should be valid with all items', function() {
            var v = lib.serviceConfiguration({
                name: "MyService",
                version: "1.2.3",
                description: "This is a service",
                main: `${__dirname}/index.js`,
                discoveryUri: "etcd-discovery.local",
                configurations: [
                    { name: "test1", value: { item1: "ITEM 1" } },
                    { name: "test2", value: { item2: "ITEM 2" } },
                ],
                container: {
                    registry: "abc123",
                    image: "xyz789"
                }
            });
            assert(v.isValid());
        });

        it('should be valid with out description, discovery, config, container', function() {
            var v = lib.serviceConfiguration({
                name: "MyService",
                version: "1.2.3",
                main: `${__dirname}/index.js`
            });
            assert(v.isValid());
        });

        it('should not be valid with out name', function() {
            var v = lib.serviceConfiguration({
                version: "1.2.3",
                description: "This is a service",
                main: `${__dirname}/index.js`,
                discoveryUri: "etcd-discovery.local",
                configurations: [
                    { name: "test1", value: { item1: "ITEM 1" } },
                    { name: "test2", value: { item2: "ITEM 2" } },
                ],
                container: {
                    registry: "abc123",
                    image: "xyz789"
                }
            });
            assert(!v.isValid());
        });

        it('should not be valid with out version', function() {
            var v = lib.serviceConfiguration({
                name: "MyService",
                description: "This is a service",
                main: `${__dirname}/index.js`,
                discoveryUri: "etcd-discovery.local",
                configurations: [
                    { name: "test1", value: { item1: "ITEM 1" } },
                    { name: "test2", value: { item2: "ITEM 2" } },
                ],
                container: {
                    registry: "abc123",
                    image: "xyz789"
                }
            });
            assert(!v.isValid());
        });

        it('should not be valid with out main', function() {
            var v = lib.serviceConfiguration({
                name: "MyService",
                version: "1.2.3",
                description: "This is a service",
                discoveryUri: "etcd-discovery.local",
                configurations: [
                    { name: "test1", value: { item1: "ITEM 1" } },
                    { name: "test2", value: { item2: "ITEM 2" } },
                ],
                container: {
                    registry: "abc123",
                    image: "xyz789"
                }
            });
            assert(!v.isValid());
        });
    });

    describe('#constructor(path)', function() {
        var tempFile = temp.openSync('test.yml');

        fs.writeSync(tempFile.fd, [
            "# Service Description Metadata.",
            "---",
            "name: RPC.ExampleService",
            "version: 0.1.0",
            "description: This is an example service description file.",
            "",
            "main: index.js",
            "",
            "discoveryUri: http://etcd.discovery.local:2379",
            "",
            "configurations:",
            "  - name: test1",
            "    value:",
            "        item1: ITEM 1",
            "  - name: test2",
            "    value:",
            "        item2: ITEM 2",
            "",
            "container:",
            "    registry: my-registry.com",
            "    image: rpc.nodejs",
        ].join('\n'));

        var v = lib.serviceConfiguration(tempFile.path);

        it('should have serviceDescription', function() {
            assert(v.serviceDescription.isValid());
        });

        it('should have containerDescription', function() {
            assert(v.containerDescription.isValid());
        });

        it('should have configurations', function() {
            assert.equal(v.configurations.test1.item1, "ITEM 1");
            assert.equal(v.configurations.test2.item2, "ITEM 2");
        });
    });
});
