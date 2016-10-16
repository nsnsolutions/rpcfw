'use strict';

module.exports = (function() {

    var self = {},
        errint = 0xFFFF0000,
        reverseErrList = {},
        errList = {
            ERRINT_BAD_REQUEST:     errint + 1,
            ERRINT_UNAUTHORIZED:    errint + 2,
            ERRINT_FORBIDDEN:       errint + 3,
            ERRINT_NOT_IMPLEMENTED: errint + 4,
            ERRINT_NOT_AVAILABLE:   errint + 5,
            ERRINT_INTERNAl_ERROR:  errint + 6,
        };

    for(var p in errList)
        if(errList.hasOwnProperty(p)) {
            self[p] = errList[p];
            reverseErrList[errList[p]] = p;
        }

    self.lookup = (code) => { return reverseErrList[code] };
    self.isBuiltin = (code) => { return code in reverseErrList };
    self.ERRSTR_FAULT_MESSAGE = "The service encountered an error and cannot continue. If the problem persists, please contact support.";

    return self;

})();
