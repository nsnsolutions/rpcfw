'use strict'

const fs = require('fs');
const serviceDescription = require('./serviceDescription');
const containerDescription = require('./containerDescription');
const etcdConfig = require('./etcdConfig');
const fixedConfig = require('./fixedConfig');

module.exports = function serviceConfiguration(obj, opts) {
    var self = {}, 
        opts = opts || {},
        needEtcdUri = false;

    if(typeof obj === 'string')
        obj = loadConfigFromFile(obj, opts.format, opts.encoding);
    
    self.serviceDescription = serviceDescription(obj || {});
    self.containerDescription = containerDescription(obj.container || {});
    self.entryPoint = obj.main;
    self.configurations = {};
    self.fixedConfigurations = {};
    self.etcdConfigurations = {};
    self.isValid = isValid;

    init();

    return self;

    // ------------------------------------------------------------------------

    function init() {
        if(obj.configurations) {
            for(var i = 0; i < obj.configurations.length; i++) {
                var entry = obj.configurations[i];

                if(entry.hasOwnProperty('key')) {
                    var c = etcdConfig(entry, opts.etcd);
                    self.configurations[entry.name] = c;
                    self.etcdConfigurations[entry.name] = c;
                    needEtcdUri = true;
                } else {
                    var c = fixedConfig(entry);
                    self.configurations[entry.name] = c;
                    self.fixedConfigurations[entry.name] = c;
                }
            }
        }
    }

    function isValid() {
        if(!self.serviceDescription.isValid()) {
            self.errorMessage = self.serviceDescription.errorMessage;
            return false;
        } else if(needEtcdUri && !opts.etcd) {
            self.errorMessage = "No connection to etcd. Missing configuration details.";
            return false;
        } else 
            return true;
    }

    function loadConfigFromFile(path, format, encoding) {

        var enc = encoding || 'utf8',
            fmt = format || undefined,
            rawString;

        if(!fs.existsSync(path))
            return {};

        rawString = fs.readFileSync(path, enc);

        if(fmt && fmt.toLowerCase() === 'json')
            return loadConfigFromFile_json(rawString);
        else if(fmt && ["yml", "yaml"].indexOf(fmt.toLowerCase()) !== -1)
            return loadConfigFromFile_ymal(rawString);
        else if(rawString.substr(0, 1) === "{")
            return loadConfigFromFile_json(rawString);
        else
            return loadConfigFromFile_ymal(rawString);
    }

    function loadConfigFromFile_json(str) {
        return JSON.parse(str);
    }

    function loadConfigFromFile_ymal(str) {
        return require('js-yaml').safeLoad(str);
    }
};
