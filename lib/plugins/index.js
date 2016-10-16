'use strict';

const rpcfwPlugin = require('./seneca-rpcfw');

module.exports = function plugins(opts) {
    rpcfwPlugin.call(this, opts);
};

