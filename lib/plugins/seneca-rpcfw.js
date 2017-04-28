'use strict';

const atry = require('atry');
const rpcfw = require('./seneca-rpcfw');
const rpcDone = require('../rpcDone');
const verifiableObject = require('../verifiableObject');

const amqpParams = {
    amqp: {
        exchange: { 
            type: "topic",
            name: "seneca.topic",
            options: { 
                durable: false,
                autoDelete: false
            } 
        },
        deadLetter: {
            queue: {
                name: "seneca.dlq",
                options: {
                    durable: false,
                    autoDelete: false
                }
            },
            exchange: {
                type: "topic",
                name: "seneca.dlx",
                options: {
                    durable: false,
                    autoDelete: false
                }
            }
        },
        client: {
            channel: { 
                prefetch: 1
            },
            queues: { 
                prefix: "res",
                separator: ".",
                options: { 
                    durable: false,
                    autoDelete: true,
                    exclusive: true,
                    "arguments": {
                        "x-dead-letter-exchange": "seneca.dlx",
                        "x-message-ttl": 60000
                    }
                }
            } 
        },
        listen: {
            channel: { 
                prefetch: 1
            },
            queues: {
                options: { 
                    durable: false,
                    "arguments": {
                        "x-dead-letter-exchange": "seneca.dlx",
                        "x-message-ttl": 60000
                    }
                }
            }
        } 
    }
};

module.exports = function plugins(opts) {

    var seneca = this,
        factorySettings = opts.factorySettings,
        serviceConfiguration = opts.serviceConfiguration,
        has_global_handler = false;

    seneca.decorate('rpcAdd', rpcAdd);

    if(!factorySettings.debug) {
        seneca.use('seneca-amqp-transport', amqpParams);
        seneca.decorate('rpcClient', rpcClient);
        seneca.decorate('rpcServer', rpcServer);
    } else {
        seneca.decorate('rpcClient', rpcClientDebug);
        seneca.decorate('rpcServer', rpcServerDebug);
    }

    return { name: "Seneca-RpcFW" }

    // ------------------------------------------------------------------------

    function rpcAdd(pattern, fn) {
        seneca.add(pattern, function(request, callback) {
            var context = this,
                args = verifiableObject(request),
                done = rpcDone(callback);

            atry(function () {
                fn.call(context, args, done);
            }).catch(function (err) {
                console.error("Failed to execute rpc call: " + pattern);
                console.error(err.stack);
                done.internalError();
            });
        });
    }

    function rpcClient(opts) {
        seneca.client({
            type: "amqp",
            url: factorySettings.amqpUri,
            pin: opts.pin
        });
    }

    function rpcServer(opts) {
        seneca.listen({
            type: "amqp",
            url: factorySettings.amqpUri,
            name: "req." + serviceConfiguration.serviceDescription.name,
            pin: opts.pin
        });
        installGlobalHandler(opts.pin);
    }

    function rpcClientDebug(opts) {
        seneca.client({ pin: opts.pin });
    }

    function rpcServerDebug(opts) {
        console.log("Listening on " + opts.pin);
        seneca.listen({ pin: opts.pin });
        installGlobalHandler(opts.pin);
    }

    function installGlobalHandler(pins) {

        if(has_global_handler || !pins)
            return;

        var _pins = typeof pins === 'string'
            ? [ pins ]
            : pins;

        for(let pin of _pins)
            seneca.rpcAdd(pin, (a,d) => d.notFound(`Method not found: "${a.role}->${a.cmd}"`));

        has_global_handler = true;
    }
};

