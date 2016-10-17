'use strict';

const verifiableObject = require('./verifiableObject');

module.exports = function fixedConfig(entry) {
    return verifiableObject(entry.value || {}, entry.name || "fixedConfig");
};
