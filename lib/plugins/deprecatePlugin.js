'use strict';

module.exports = function(pattern, aternate) {

    var seneca = this;

    seneca.decorate('deprecate', deprecate);

    return { name: "DeprecatePlugin" }

    // ------------------------------------------------------------------------

    function deprecate(pattern, alternate) {

        let alt;

        if(alternate && typeof alternate === 'string')
            alt = alternate;
        else if(alternate && typeof alternate === 'object')
            alt = seneca.util.pattern(alternate);
        else
            alt = "No alternate provided";

        console.warn(`Deprecating ${pattern}`);

        seneca.sub(pattern, (args) => {
            console.warn("!! ***************************** DEPRECATION NOTICE ***************************** !!");
            console.warn("!! This method will be removed from future releases of this service. To avoid     !!");
            console.warn("!! errors in dependent services, please update code that utilizses this service.  !!");
            console.warn("!! ------------------------------------------------------------------------------ !!");
            console.warn(`!! - deprecated: ${args.meta$.pattern}`);
            console.warn(`!! - alternative: ${alt}`);
            console.warn("!! *************************** END DEPRECATION NOTICE *************************** !!");
        });
    }
}
