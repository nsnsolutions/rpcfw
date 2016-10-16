'use strict';

module.exports = function linkObject(obj) {
    function F() {};
    F.prototype = obj;
    return new F();
};
