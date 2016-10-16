'use strict'

const fs = require('fs');
const serviceDescription = require('./serviceDescription');
const containerDescription = require('./containerDescription');
const etcdConfig = require('./etcdConfig');
const fixedConfig = require('./fixedConfig');

module.exports = function serviceConfiguration(obj, opts) {
    var self = {},
        needEtcdUri = false;

    if(typeof obj === 'string')
        obj = loadConfigFromFile(obj, opts);
    
    self.serviceDescription = serviceDescription(obj || {});
    self.containerDescription = containerDescription(obj.container || {});
    self.discoveryUri = process.env.SERVICE_DISCOVERY_URI || obj.discoveryUri;
    self.entryPoint = obj.main;
    self.configurations = {};
    self.isValid = isValid;

    init();

    return self;

    // ------------------------------------------------------------------------

    function init() {
        if(obj.configurations) {
            for(var i = 0; i < obj.configurations.length; i++) {
                var entry = obj.configurations[i];

                if(entry.hasOwnProperty('key')) {
                    needEtcdUri = true;
                    self.configurations[entry.name] = etcdConfig(entry);
                } else {
                    self.configurations[entry.name] = fixedConfig(entry);
                }
            }
        }
    }

    function isValid() {
        if(!self.serviceDescription.isValid())
            return false;
        else if(needEtcdUri && !self.discoveryUri)
            return false;
        else if(!self.entryPoint)
            return false;
        else 
            return true;
    }

    function loadConfigFromFile(path, opts) {

        var encoding = opts && opts.encoding || 'utf8',
            fmt = opts && opts.format || undefined,
            rawString;

        if(!fs.existsSync(path))
            return {};

        rawString = fs.readFileSync(path, encoding);

        if(fmt && fmt.toLowerCase() === 'json')
            return loadConfigFromFile_json(rawString);
        else if(fmt && ["yml", "yaml"].indexO(fmt.toLowerCase()) !== -1)
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
