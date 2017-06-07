'use strict';

const rpcfwPlugin = require('./seneca-rpcfw');
const deprecatePlugin = require('./deprecatePlugin');

module.exports = function plugins(opts) {
    rpcfwPlugin.call(this, opts);
    deprecatePlugin.call(this, opts);
};

