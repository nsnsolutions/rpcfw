'use strict';

const Etcd = require('node-etcd');
const path = require('path');
const rpclib = require('../');
const splash = require('./_splash');

module.exports = function(opts) {

    var configPath = path.resolve(process.cwd(), opts.config),
        etcd = new Etcd(opts.discovery_uri),

        srvConfig = rpclib.serviceConfiguration(configPath, {
            etcd: etcd,
            format: opts.fmt,
            encoding: opts.encoding 
        }),
        keys = opts.only || Object.keys(srvConfig.etcdConfigurations),
        exported = {};

    if(srvConfig.etcdConfigurations.length < 1) {
        console.error(`No ETCD Configurations available for ${srvConfig.serviceDescription.name}`);
        return process.exit(0);
    }

    keys.forEach((key) => {
        var item = srvConfig.etcdConfigurations[key];
        var entry = srvConfig.getConfigEntry(key);

        if(!item)
            return console.error(`WARNING: No configuration named ${key} in ${srvConfig.serviceDescription.name}`);

        exported[key] = {
            value: item.raw,
            key: entry.key
        }
    });

    process.stdout.write(JSON.stringify(exported));
    process.exit();
}
