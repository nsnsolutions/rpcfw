#! /usr/bin/env node
'use strict';

const ArgumentParser = require('argparse').ArgumentParser;
const packageJson = require('../package.json');

function getOpts() {

    var ap = new ArgumentParser({
        version: `${packageJson.name} v${packageJson.version}`,
        description: packageJson.description,
        addHelp: true
    });

    var subap = ap.addSubparsers({
        title: "Select an action",
        dest: "action"
    });

    // RUN

    var runAp = subap.addParser('run', { 
        addHelp: true,
        description: "Run a service using the provided configuration file."
    });

    runAp.addArgument(
        [ '--debug' ],
        {
            help: "Expose service or connect client using seneca builtin web interface.",
            defaultValue: false,
            action: "storeTrue"
        }
    );

    runAp.addArgument(
        [ '--no-ha' ],
        {
            help: "Disable HA configuration on queues owned by this service.",
            defaultValue: false,
            action: "storeTrue"
        }
    );

    runAp.addArgument(
        [ '--logLevel' ],
        {
            help: "Optional: Set the logLevel for the current execution.",
            defaultValue: 'info'
        }
    );

    runAp.addArgument(
        [ '--amqpKey' ],
        {
            help: "Optional: Tell the appFactory where to get the connection string to the rpc bus.",
            defaultValue: '/config/esb/rpc'
        }
    );

    runAp.addArgument(
        [ '--amqpUri' ],
        {
            help: "Optional: Specify an amqp connection string.",
            defaultValue: undefined
        }
    );

    runAp.addArgument(
        [ '--discovery-uri' ],
        {
            help: "The uri used to connect to etcd. Default: Value stored in env SERVICE_DISCOVERY_URI",
            defaultValue: process.env.SERVICE_DISCOVERY_URI
        }
    );

    runAp.addArgument(
        [ '--encoding' ],
        {
            help: "Specify the character encoding of the service configuration file.",
            choices: [
                "ascii", "ucs2", "ucs-2", "utf16le",
                "utf-16le", "utf8", "utf-8"
            ],
            defaultValue: undefined
        }
    );

    runAp.addArgument(
        [ '--fmt' ],
        {
            help: "Specify the format of the service configuration file.",
            choices: [ "json", "yaml", "yml" ],
            defaultValue: undefined
        }
    );

    runAp.addArgument(
        [ '--working-dir' ],
        {
            help: "Specify the working directory if diffrent the current.",
            defaultValue: "./"
        }
    );

    runAp.addArgument(
        [ 'config' ],
        {
            help: "The path to the configuration yaml or json file that describes the service to ran.",
        }
    );

    return ap.parseArgs();
}

(function main() {
    var opts = getOpts();
    console.log(opts);

    try {
        switch(opts.action) {
            case 'run':
                require('./_subRun')(opts);
                break;
            case 'build':
            case 'init':
                console.warn("Not Implemented");
                break;
            default:
                console.error("Unknown action. I give up.");
                break;
        }
    } catch (err) {
        console.error("ERROR: " + err.message);
        process.exit(1);
    }

})();
