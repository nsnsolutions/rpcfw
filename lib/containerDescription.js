'use strict';

module.exports = function containerDescription(obj) {
    var self = {};

    self.registry = obj.registry;
    self.image = obj.image;

    self.toString = toString;
    self.isValid = isValid;

    return self;

    // ------------------------------------------------------------------------

    function toString(tag) {
        if(self.registry && tag)
            return `${self.registry}/${self.image}:${tag}`;

        else if(self.registry)
            return `${self.registry}/${self.image}`;

        else
            return self.image;
    }

    function isValid() {
        if(!self.image) {
            self.errorMessage = "No image name provided."
            return false;
        } else if(!self.registry) {
            self.errorMessage = "No registry name provided."
            return false;
        } else {
            return true;
        }
    }
};
