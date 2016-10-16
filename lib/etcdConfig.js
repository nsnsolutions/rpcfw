'use strict';

const verifiableObject = require('./verifiableObject');

module.exports = function etcdConfig(entry, opts) {
    var rootKey = entry.key,
        recursive = entry.recursive || true,
        shouldWatch = entry.watch || false,
        etcd = opts.etcd,
        onChange = opts.onChange,
        debounce = opts.debounce || 1000,
        onChangeTimeout, obj, self;
   
    if(!etcd)
        throw { 
            name: "ReferenceError",
            message: "Missing or invalid argument for opts.etcd." 
        };

    self = verifiableObject(init(), entry.name + `(${rootKey})`);

    return self;

    // ------------------------------------------------------------------------

    function init() {
        var value, resp = etcd.getSync(rootKey, { recursive: recursive });

        if(resp.err) {
            console.warn(err);
            return {};
        } else if(shouldWatch) {
            var watcher = etcd.watcher(rootKey, null, { recursive: recursive });
            watcher.on("change", (e) => doUpdate(e.node));
        }

        return node2object(resp.body.node);
    }

    function doUpdate(node) {
        if(onChangeTimeout)
            clearTimeout(onChangeTimeout);

        onChangeTimeout = setTimeout(() => {
            var key = node.key.replace(rootKey + "/", "").replace("/", ".");
            if(self.set(key, node.value) !== node.value && onChange)
                onChange(self);
        }, debounce);
    }

    function node2object(node) {
        if(!node.dir)
            return node.value;

        var ret = {}
        for(var i = 0; i < node.nodes.length; i++) {
            var item = node.nodes[i];
            var key = item.key.replace(node.key + "/", "");
            ret[key] = node2object(item);
        }

        return ret;
    }
};
