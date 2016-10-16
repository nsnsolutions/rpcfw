'use strict'

module.exports = function serviceDescription(obj) {
    var self = {},
        version_parts = obj.version && obj.version.split('.');

    self.name = obj.name;
    self.description = obj.description || "";
    self.version = {
        major: Number(version_parts && version_parts[0]),
        minor: Number(version_parts && version_parts[1]),
        patch: Number(version_parts && version_parts[2]),
        toString: () => {  
            return [ self.version.major,
                     self.version.minor,
                     self.version.patch ].join(".") 
        }
    }

    self.toString = () => { return `${self.name} v${self.version.toString()}`; }
    self.isValid = isValid;

    return self;

    // ------------------------------------------------------------------------

    function isValid() {
        if(!self.name)
            return false;
        else if(!self.version.major)
            return false;
        else if(!self.version.minor)
            return false;
        else if(!self.version.patch)
            return false;
        else
            return true;
    }
};
