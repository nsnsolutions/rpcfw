'use strict'

module.exports = function MockEtcd() {
    var self = this,
        cbs = {};

    self.getSync = getSync;
    self.watcher = watcher;
    self.raiseChangedEvent = raiseChangedEvent;
    
    return self;

    // ------------------------------------------------------------------------

    function raiseChangedEvent() {
        for(var i = 0; i < cbs["change"].length; i++) {
            cbs["change"][i]({
                "value" : "ITEM3.1",
                "modifiedIndex" : 154,
                "key" : "/tests/rpcfw/ut/item3/item1",
                "createdIndex" : 154
            });
        }
    }

    function getSync(key, opts) {
        if(opts && opts.recursive) {
            return {
                "body" : {
                    "node" : {
                        "nodes" : [
                            {
                            "createdIndex" : 151,
                            "key" : "/tests/rpcfw/ut/item1",
                            "modifiedIndex" : 151,
                            "value" : "ITEM1"
                            },
                            {
                            "createdIndex" : 152,
                            "modifiedIndex" : 152,
                            "value" : "2",
                            "key" : "/tests/rpcfw/ut/item2"
                            },
                            {
                            "modifiedIndex" : 19,
                            "key" : "/tests/rpcfw/ut/item3",
                            "nodes" : [
                                {
                                    "value" : "ITEM3.1",
                                    "modifiedIndex" : 154,
                                    "key" : "/tests/rpcfw/ut/item3/item1",
                                    "createdIndex" : 154
                                }
                            ],
                            "createdIndex" : 19,
                            "dir" : true
                            }
                        ],
                        "dir" : true,
                        "createdIndex" : 17,
                        "key" : "/tests/rpcfw/ut",
                        "modifiedIndex" : 17
                    },
                    "action" : "get"
                },
                "err" : null,
                "headers" : {
                    "x-etcd-index" : "154",
                    "content-length" : "464",
                    "x-etcd-cluster-id" : "7e27652122e8b2ae",
                    "date" : "Sun, 16 Oct 2016 06:48:56 GMT",
                    "content-type" : "application/json",
                    "x-raft-term" : "2",
                    "x-raft-index" : "374080"
                }
            }
        } else {
            return {
                "body" : {
                    "node" : {
                        "nodes" : [
                            {
                            "createdIndex" : 151,
                            "key" : "/tests/rpcfw/ut/item1",
                            "modifiedIndex" : 151,
                            "value" : "ITEM1"
                            },
                            {
                            "createdIndex" : 152,
                            "modifiedIndex" : 152,
                            "value" : "2",
                            "key" : "/tests/rpcfw/ut/item2"
                            },
                            {
                            "modifiedIndex" : 19,
                            "key" : "/tests/rpcfw/ut/item3",
                            "createdIndex" : 19,
                            "dir" : true
                            }
                        ],
                        "dir" : true,
                        "createdIndex" : 17,
                        "key" : "/tests/rpcfw/ut",
                        "modifiedIndex" : 17
                    },
                    "action" : "get"
                },
                "err" : null,
                "headers" : {
                    "x-etcd-index" : "154",
                    "content-length" : "464",
                    "x-etcd-cluster-id" : "7e27652122e8b2ae",
                    "date" : "Sun, 16 Oct 2016 06:48:56 GMT",
                    "content-type" : "application/json",
                    "x-raft-term" : "2",
                    "x-raft-index" : "374080"
                }
            }
        }
    }

    function watcher(key, index, opts) {
        var cb = function(e, cb) { 
            if(!cbs[e])
                cbs[e] = [];
            cbs[e].push(cb);
        }
        return { on: cb }
    }
};
