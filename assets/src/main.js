'use strict';

module.exports = function {{ SERVICE_NAME.replace(r/\./g, "_") }}(App) {

    var app = App({
        onConfigUpdate: function(name, conf) {

            /*
             * Called when an etcd configuration changes.
             * This only applies if a watch is set in your config.
             * 
             * args:
             * - name: name of the config that changed.
             * - config: the config as a verifiableObject.
             *
             * Context:
             * - bound to appContext.
             */

            console.log(`Configuration changed: ${name}`);

            // Restart the sevice.
            //this.restart();
        },
        onStart: function(bus, confs) {

            /*
             * Called only once when the service is first started. This method
             * must be provided.
             *
             * args:
             * - bus: The senecajs object. Install your plugins here.
             * - configs: A map containing the configs specified in your
             *   service description file.
             *
             * context:
             * - Bound to appContext.
             */

            console.log(`STARTUP - Please open ${__filename} and create your service`);
            installPlugins(bus, confs);
        },
        onRestart: function(bus, confs) {

            /*
             * Called each time the service is restarted. This method must be
             * provided.
             *
             * args:
             * - bus: The senecajs object. Install your plugins here.
             * - configs: A map containing the configs specified in your
             *   service description file.
             *
             * context:
             * - Bound to appContext.
             */

            console.log(`RESTART - Please open ${__filename} and create your service`);
            installPlugins(bus, confs);
        },
        onShutdown: function(bus, confs) {

            /*
             * Called each time the service is shutdown. This method is
             * optional but it is the only way to programaticly exit the
             * process.
             *
             * args:
             * - bus: The senecajs object. Install your plugins here.
             * - configs: A map containing the configs specified in your
             *   service description file.
             *
             * context:
             * - Bound to appContext.
             */

            console.log(`SHUTDOWN - Please open ${__filename} and create your service`);
            process.exit(0);
        }
    });

    // Start the service
    app.start();

    // Shutdown the service.
    //app.shutdown();

    function installPlugins(bus, confs) {

        /*
         * You can connect as both a client and a server.
         * See SenecaJS documentation for more information.
         * http://senecajs.org/
         */

        /*

        // Install plugins here
        bus.use("src/{{ SERVICE_NAME.replace(r/\./g, '-') }}", confs);

        // Start Client - If you want to call other services.
        bus.rpcClient({ pin: "role:*" });

        // Start Server - If you want to expose services.
        bus.rpcServer({ pin: [
          "role:{{ SERVICE_NAME.replace(r/\./g, '-') }}",
          "role:{{ SERVICE_NAME.replace(r/\./g, '-') }}.Pub"
        ]});

        */
    }
}
