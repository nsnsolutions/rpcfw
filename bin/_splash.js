'use strict';

module.exports = function splash(conf, cont) {
    console.log("--------------------------------------------------");
    console.log("Service: " + conf.serviceDescription.toString());
    if(conf.entryPoint)
        console.log("Entry point: " + conf.entryPoint);
    if(cont) {
        console.log("Service Discovery: " + cont.etcd.hosts.join(", "));
        console.log("RPC Mode: " + (cont.isInDebugMode ? "HTTP (debug)" : "AMPQ"));
        console.log("Log Level: " + cont.logLevel);
        console.log("Configs: " + Object.keys(cont.configurations).join(', '));
    }
    if(conf.containerDescription.isValid()) {
        console.log("Docker Registry: " + conf.containerDescription.registry);
        console.log("Docker image: " + conf.containerDescription.image);
    }
    console.log("Working Dir: " + process.cwd());
    console.log("--------------------------------------------------");
}

