'use strict';

const uuid = require('node-uuid');

module.exports = function heatBeat(opts) {

    var etcd = opts.etcd,
        name = opts.serviceDescription.name,
        version = opts.serviceDescription.version.toString(),
        description = opts.serviceDescription.description,
        uid = uuid.v4(),
        key = opts.key + "/" + name + ":" + version + ":" + uid,
        params = { ttl: 30 },
        data = JSON.stringify({ name: name,
                 description: description,
                 version: version,
                 started: new Date().getTime() / 1000 | 0,
                 uuid: uid });

    if(etcd)
        beat();

    // ------------------------------------------------------------------------

    function beat() {
        etcd.set(key, data, params, (err) => {
            if(err)
                console.warn(err);

            setTimeout(beat, 20000);
        });
    }
}
