'use strict';

module.exports = function splash(conf, cont) {
    console.log("--------------------------------------------------");
    console.log("Service: " + conf.serviceDescription.toString());
    console.log("Entry point: " + conf.entryPoint);
    if(cont) {
        console.log("Service Discovery: " + cont.etcd.hosts.join(", "));
        console.log("RPC Mode: " + (cont.isInDebugMode ? "HTTP (debug)" : "AMPQ"));
        console.log("Log Level: " + cont.logLevel);
        console.log("Configs: " + Object.keys(cont.configurations).join(', '));
    }
    console.log("Working Dir: " + process.cwd());
    console.log("--------------------------------------------------");
}

