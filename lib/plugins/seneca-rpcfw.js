'use strict';

const rpcfw = require('./seneca-rpcfw');
const rpcDone = require('../rpcDone');
const verifiableObject = require('../verifiableObject');

module.exports = function plugins(opts) {

    var seneca = this,
        factorySettings = opts.factorySettings,
        serviceConfiguration = opts.serviceConfiguration;

    seneca.decorate('rpcAdd', rpcAdd);

    if(!factorySettings.debug) {
        seneca.use('seneca-amqp-transport');
        seneca.decorate('rpcClient', rpcClient);
        seneca.decorate('rpcServer', rpcServer);
    } else {
        seneca.decorate('rpcClient', rpcClientDebug);
        seneca.decorate('rpcServer', rpcServerDebug);
    }

    return { name: "Seneca-RpcFW" }

    // ------------------------------------------------------------------------

    function rpcAdd(pattern, fn) {
        seneca.add(pattern, (m,d) => fn(verifiableObject(m), rpcDone(d)));
    }

    function rpcClient(opts) {
        seneca.client({
            type: "amqp",
            url: factorySettings.amqpUri,
            queues: { action: { options: { durable: false } } },
            pin: opts.pin
        });
    }

    function rpcServer(opts) {
        seneca.listen({
            type: "amqp",
            url: factorySettings.amqpUri,
            queues: { action: { options: { durable: false } } },
            name: (factorySettings.isHa ? "ha." : "") + serviceConfiguration.serviceDescription.name,
            pin: opts.pin
        });
    }

    function rpcClientDebug(opts) {
        seneca.client({ pin: opts.pin });
    }

    function rpcServerDebug(opts) {
        console.log("Listening on " + opts.pin);
        seneca.listen({ pin: opts.pin });
    }
};

