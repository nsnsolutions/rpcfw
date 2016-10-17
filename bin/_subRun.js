'use strict';

const rpclib = require('../lib');
const splash = require('./_splash')
const Etcd = require('node-etcd');
const path = require('path');

module.exports = function Run(opts) {

    var configPath = path.resolve(process.cwd(), opts.config),
        etcd = new Etcd(opts.discovery_uri),
        srvConfig = rpclib.serviceConfiguration(configPath, {
            etcd: etcd,
            format: opts.fmt,
            encoding: opts.encoding 
        }),
        appContext = rpclib.appFactory(srvConfig, {
            etcd: etcd,
            debug: opts.debug,
            isHa: !opts.no_ha,
            logLevel: opts.logLevel,
            amqpKey: opts.amqpKey,
            amqpUri: opts.amqpUri
        });

    process.chdir(opts.working_dir);
    splash(srvConfig, appContext);

    require(path.join(process.cwd(), srvConfig.entryPoint))(appContext);
}
