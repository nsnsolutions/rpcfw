'use strict'

module.exports = function serviceDescription(obj) {
    var self = {},
        version_parts = obj.version && obj.version.split('.');

    self.name = obj.name;
    self.description = obj.description || "";
    self.version = {
        major: !!version_parts && !!version_parts[0] && Number(version_parts[0]),
        minor: !!version_parts && !!version_parts[1] && Number(version_parts[1]),
        patch: !!version_parts && !!version_parts[2] && Number(version_parts[2]),
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
        if(!self.name) {
            self.errorMessage = "Missing name.";
            return false;
        } else if(Number(self.version.major) !== self.version.major) {
            self.errorMessage = "Invalid version identifier.";
            return false;
        } else if(Number(self.version.minor) !== self.version.minor) {
            self.errorMessage = "Invalid version identifier.";
            return false;
        } else if(Number(self.version.patch) !== self.version.patch) {
            self.errorMessage = "Invalid version identifier.";
            return false;
        } else {
            return true;
        }
    }
};
