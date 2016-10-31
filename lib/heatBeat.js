'use strict';

const uuid = require('node-uuid');

module.exports = function heatBeat(opts) {

    var etcd = opts.etcd,
        key = opts.key + "/" + opts.serviceDescription.name + ":" + opts.serviceDescription.version.toString() + ":" + uuid.v4(),
        params = { ttl: 30 },
        data = JSON.stringify({ name: opts.serviceDescription.name,
                 description: opts.serviceDescription.description,
                 version: opts.serviceDescription.version.toString(),
                 started: new Date().getTime() / 1000 | 0 });

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
