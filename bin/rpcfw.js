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
        [ '--log-level' ],
        {
            help: "Optional: Set the log level for the current execution.",
            defaultValue: 'info'
        }
    );

    runAp.addArgument(
        [ '--amqp-key' ],
        {
            help: "Optional: Tell the appFactory where to get the connection string to the rpc bus.",
            defaultValue: '/config/esb/rpc'
        }
    );

    runAp.addArgument(
        [ '--amqp-uri' ],
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
        [ '--format' ],
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

    // INIT

    var initAp = subap.addParser('init', { 
        addHelp: true,
        description: "Initialize a new project with templates."
    });

    initAp.addArgument(
        [ "--clobber" ],
        {
            help: "Allow clobbering of existing files in the working directory.",
            action: "storeTrue",
            defaultValue: false
        }
    );

    initAp.addArgument(
        [ "dir" ],
        {
            help: "The path to create the new project in.",
            defaultValue: "./"
        }
    );

    // ETCD-EXPORT

    var etcdExportAp = subap.addParser('etcd-export', {
        addHelp: true,
        description: "Extract the etcd configs used by a service."
    });

    etcdExportAp.addArgument(
        [ "--discovery-uri" ],
        {
            help: "The uri used to connect to etcd. Default: Value stored in env SERVICE_DISCOVERY_URI",
            defaultValue: process.env.SERVICE_DISCOVERY_URI
        }
    );

    etcdExportAp.addArgument(
        [ "--only" ],
        {
            help: "Optionaly limit to a set of configuration names.",
            type: String,
            nargs: "+",
            defaultValue: undefined
        }

    );

    etcdExportAp.addArgument(
        [ "config" ],
        {
            help: "Path to the service configuration file."
        }
    );

    // ETCD-IMPORT

    var etcdImportAp = subap.addParser('etcd-import', {
        addHelp: true,
        description: "Import the given json into etcd."
    });

    etcdImportAp.addArgument(
        [ "--discovery-uri" ],
        {
            help: "The uri used to connect to etcd. Default: Value stored in env SERVICE_DISCOVERY_URI",
            defaultValue: process.env.SERVICE_DISCOVERY_URI
        }
    );

    etcdImportAp.addArgument(
        [ "--only" ],
        {
            help: "Optionaly limit to a set of configuration names.",
            type: String,
            nargs: "+",
            defaultValue: undefined
        }

    );

    etcdImportAp.addArgument(
        [ "json" ],
        {
            help: "Path to the exported etcd json data that will be imported."
        }
    );

    return ap.parseArgs();
}

(function main() {
    var opts = getOpts();

    //try {
        switch(opts.action) {
            case 'run':
                require('./_subRun')(opts);
                break;
            case 'init':
                require('./_subInit')(opts);
                break;
            case 'etcd-export':
                require('./_subEtcdExport')(opts);
                break;
            case 'etcd-import':
                require('./_subEtcdImport')(opts);
                break;
            default:
                console.error("Unknown action. I give up.");
                break;
        }
    //} catch (err) {
      //console.error("ERROR: " + err.message);
      //process.exit(1);
    //}

})();
