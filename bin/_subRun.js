'use strict';

const rpclib = require('../lib');
const splash = require('./_splash')
const Etcd = require('node-etcd');
const path = require('path');

module.exports = function Run(opts) {

    var configPath = path.resolve(process.cwd(), opts.config),
        etcd = new Etcd(opts.discovery_uri),
        amqpUri = opts.amqp_uri;

    if(!opts.debug && !amqpUri) {

        /*
         * Load the amqp uri from etcd unless explicitly passed.
         */

        if(!opts.amqp_key)
            throw { name: "Error", message: "Missing configuration 'amqp key'" };

        amqpUri = loadOrThrow(opts.amqp_key);
    }

    var srvConfig = rpclib.serviceConfiguration(configPath, {
            etcd: etcd,
            format: opts.format,
            encoding: opts.encoding 
        }),
        appContext = rpclib.appFactory(srvConfig, {
            etcd: etcd,
            debug: opts.debug,
            logLevel: opts.log_level,
            amqpUri: amqpUri
        });

    process.chdir(opts.working_dir);
    splash(srvConfig, appContext);

    require(path.join(process.cwd(), srvConfig.entryPoint))(appContext);

    // ------------------------------------------------------------------------

    function loadOrThrow(key) {

        var node = etcd.getSync(key);

        if(node.err)
            throw {
                name: "Error",
                message: `Missing configuration: Cannot find key in etcd ${key}.`
            }
        else
            return node.body.node.value;
    }
}
