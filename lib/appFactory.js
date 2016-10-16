'use strict';

const seneca = require('seneca');
const plugins = require('./plugins');
const verifiableObject = require('./verifiableObject');

module.exports = function appFactory(config, factorySettings) {

    if(!config.isValid())
        throw {
            name: "InvalidConfig",
            message: "The service configuration is not valid. Please check your Service file."
        }

    factorySettings = verifiableObject(factorySettings, 'factorySettings');
    factorySettings.ensureExists('debug', false);
    factorySettings.ensureExists('logLevel', 'info');
    factorySettings.ensureExists('isHa', true);
    factorySettings.assertMember('etcd', Object);

    if(!factorySettings.has('amqpUri', String) && !factorySettings.has('amqpKey', String))
        throw {
            name: "InvalidConfig",
            message: "Neither amqpKey or amqpUri was provided to appFactory."
        };

    // Try to load the amqp uri out of etcd. Allow factorySettings to override.
    if(!factorySettings.has('amqpUri')) {
        var node = factorySettings.etcd.getSync(factorySettings.amqpKey);
        if(node.err && !factorySettings.debug)
            throw {
                name: "InvalidConfig",
                message: `No amqpUri given and cannot find value in etcd ${factorySettings.amqpKey}.`
            }
        else
            factorySettings.set('amqpUri', node.body.node.value);
    }

    appContext.__defineGetter__('etcd', () => { return factorySettings.etcd; });
    appContext.__defineGetter__('isInDebugMode', () => { return factorySettings.debug; });
    appContext.__defineGetter__('logLevel', () => { return factorySettings.logLevel; });
    appContext.__defineGetter__('serviceDescription', () => { return config.serviceDescription; });
    appContext.__defineGetter__('configurations', () => { return config.configurations; });

    return appContext;

    // ------------------------------------------------------------------------
    
    function appContext(opts) {

        var onConfigUpdate = opts.onConfigUpdate,
            onStart = opts.onStart,
            onRestart = opts.onRestart,
            onShutdown = opts.onShutdown,
            bus;

        var self = {
            start: start,
            restart: restart,
            shutdown: shutdown
        };

        if(onConfigUpdate)
            installConfigCallback();

        return self;

        // ------------------------------------------------------------------------

        function start(opts) {
            setupSeneca();
            onStart.call(self, bus, config.configurations);
        }

        function restart(opts) {
            bus.close((err) => {
                if(err)
                    console.error(err);
                setupSeneca();
                onRestart.call(self, bus, config.configurations);
            });
        }

        function shutdown(opts) {
            bus.close((err) => {
                if(err) 
                    console.error(err);
                if(onShutdown)
                    onShutdown.call(self, bus, config.configurations);
            });
        }

        function setupSeneca() {
            bus = seneca({ log: { level: factorySettings.logLevel } });

            // Install plugins directly otherwise they might not be loaded when
            // the app.onStart is executed.
            plugins.call(bus, {
                factorySettings: factorySettings,
                serviceConfiguration: config
            });
        }

        function installConfigCallback() {
            for(var p in config.etcdConfigurations) {
                if(!config.etcdConfigurations.hasOwnProperty(p))
                    continue;

                /*
                 * onConfigUpdate expects params:
                 * - name: the name of the config section.
                 * - config: the etcdConfigObject that raised the change.
                 *
                 * It is also expected to be bound to the appContext.
                 *
                 * Using closure, create a function scope for the current name
                 * we are handinging in the loop and create a callback bound to
                 * that scope.
                 */

                config.etcdConfigurations[p].onUpdate = (function(name) {
                    return function(etcdConfigObject) {
                        onConfigUpdate.call(self, name, etcdConfigObject);
                    }
                })(p);
            }
        }
    };
};
