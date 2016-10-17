'use strict';

module.exports = function tryRequire(pkg) {
    try { return require(pkg) }
    catch (err) {
        console.error(`Missing module ${pkg}. Please install developer dependencies.`);
        process.exit(1);
    }
}
