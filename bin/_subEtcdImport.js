'use strict';

const Etcd = require('node-etcd');
const fs = require('fs');

module.exports = function(opts) {

    if(opts.json === '-')
        readStdin(continueImport);
    else
        fs.readFile(opts.json, continueImport);
    
    function continueImport(err, data) {
        if(err)
            return console.err(err.message);

        var importData = JSON.parse(data.toString('utf8')),
            keys = opts.only || Object.keys(importData),
            etcd = new Etcd(opts.discovery_uri);

        keys.forEach((key) => {
            var entry = importData[key];

            if(!entry)
                return console.error(`WARNING: No configuration named ${key} in json file.`);

            var etcdNodes = jsonToEtcd(entry.value, entry.key.replace(/\/$/i, ''));

            for(var p in etcdNodes) {
                if(!etcdNodes.hasOwnProperty(p))
                    continue;

                etcd.set(p, etcdNodes[p], (e, m) => {
                    if(e)
                        console.err(e);
                    else
                        console.log(`[${key}]`, m.node.key);
                });
            }

        });
    }
}

function readStdin(cb) {
    var ret = [], err = [];
    process.stdin.on('data', (data) => ret.push(data.toString('utf8')));
    process.stdin.on('error', (data) => err.push(data));
    process.stdin.on('end', () => {
        if(err.length === 0)
            cb(null, new Buffer(ret.join()));
        else
            cb({ name: "Error", message: err.join() });
    });
}

function jsonToEtcd(j, k, catalog) {
    var keys = Object.keys(j);
    var clog = catalog || {};

    for(var i = 0; i < keys.length; i++) {
        var objKey = keys[i];
        var etcdPath = k + "/" + objKey;
        var item = j[objKey]
        if(typeof item === 'object' && !('slice' in item)) {
            jsonToEtcd(item, etcdPath, clog);
        } else if(typeof item === 'object') {
            clog[etcdPath] = JSON.stringify(item);
        } else {
            clog[etcdPath] = item;
        }
    }

    return clog;
}
