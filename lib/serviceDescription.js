'use strict'

module.exports = function serviceDescription(obj) {
    var self = {};

    self.name = obj.name;
    self.description = obj.description || "";
    self.version = obj.version;

    self.toString = toString;
    self.isValid = isValid;

    return self;

    // ------------------------------------------------------------------------

    function toString() {
        return `${self.name} v${self.version}`;
    }

    function isValid() {
        if(!self.name)
            return false;
        else if(!self.version)
            return false;
        else
            return true;
    }
};

serviceDescription = {
    name: ServiceName,
    description: ServiceDescription,
    version: 0.0.0,
    toString: () { return `${this.name} v${this.version}` }
}
