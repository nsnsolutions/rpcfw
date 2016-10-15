# RpcFw

Remote Procedure Call Framework built on senecajs, rabbitmq, and etcd.

## Brainstorm on CLI

`rpcfw run Service.yml`

This will load Service.yaml and do the following things:

- read the name, version, description for a service health method.
- read the main to find the runnable nodejs file _See bellow_
- read the discovery uri and configs array and load them (etcd and static configs)
- skip plugins and pins. that is no longer applicable.
- build a restartable service object that points the "installer" to the runnable listed in service.yml

Installer might look like this:

```nodejs
const Express = require('express');

var webApp = null,
    webServer = null;

module.exports = function installer(rc) {

    /*
     * Initialize service.
     * 
     * This method will setup the service and install the plugins on the 
     * current service context. The method will be called each time the
     * service is started or restarted. 
     *
     * Arguments:
     *   rc: The count of times the service has been started or restarted.
     *
     * Context:
     *   Seneca object holding RpcFw decorators. See documentation.
     */

    if(webServer) webServer.close()
    webApp = Express();

    this.use('myPlugin');
    this.ready(() => {
        webServer = webApp.listen()
    });

    this.connectClient(['role:*']);
    this.connectServer(['role:MyService']);

};
```

Basicly, the config is loaded and creates the following objects:

```nodejs
// Typeof ServiceDescription
serviceDescription = {
    name: ServiceName,
    description: ServiceDescription,
    version: 0.0.0,
    toString: () { return `${this.name} v${this.version}` }
}

```

```nodejs
// TypeOf ConfigCollection
configCollection = {
    namedConfig: typeof EtcdConfig,
    namedConfig: typeof FixedConfig,
}

```

Seneca Decorations

- etcd (TypeOf Node-Etcd)
- serviceDiscription (TypeOf ServiceDescription)
- configCollection (TypeOf ConfigCollection)

---

`rpcfw build [--push] [--docker-file FILE] Service.yml`

Build the docker image.
- load the service config
  - containerDetails
  - serviceDescription
- connect to registry and get the last build number for this version
- build a new image with the new build version (use default Dockerfile unless
  an override has been provided)
- if --push is set, push the new image to the registry.

---

`rpcfw init`

Pretty much exactly the same way it works now with new templates.

---

# Service.yml

The Service.yml (or Service.json) holds the service metadata. You could use the
package.json in place of the service.yml if you would like.

- name: The name of the service
- description: A description of the service.
- version: The version of the service.
- discoveryUri: The uri or list of uris to connect to etcd.
- main: The entrypoint for the program that exports the ervice installer.
- configurations: A ConfigCollection initialization array. _See Below_
- container: An object holding repository and image name.
  - registry: The uri for a repository. If not present, dockerhub is used.
  - image: the image name for this docker container.

Example
```yaml
# Service Description Metadata.
---
name: RPC.ExampleService
version: 0.1.0
description: This is an example service description file.

main: index.js

discoveryUri: http://etcd.discovery.local:2379

configurations:
  - name: runtime
    key: /config/service/ExampleService
    recursive: true
    watch: true
  - name: init
    value:
        port: 8080
        logLevel: debug

container:
    registry: my-registry.com
    image: rpc.nodejs
```

## Configurations

Configurations is a collection of objects that either contain etcd keys to
collect a config or the value of a config.

A etcd configuration entry has the following options:

- name: Required, The name the configuration will be attached to in the
  configCollection.
- key: Required, The etcd key to load that holds the configuration data. This
  must point to a directory node, not a value node.
- recursive: Optional, If true, the children of the node at key will also be
  loaded as well as thier children and so on.
- watch: optional, If true, the service will be restarted on any change to the
  configuration directory tree.

A fixed configuration entry has the following options:

- name: Required, the name the configuration will be attached to in the
  configCollection.
- value: Required, A object containing the configuration fields and values.

# Identified Objects

The following are objects defined inside the lib

## ServiceDescription

Contains the details of the service.

- name
- version
- description

## ConfigCollection

Contains each of the configuration entries. Each entry will be of one of the 2
config types: [EtcdConfig], [FixedConfig]

## ConfigObject

The root class of each Config type. Holds specific prototypes for verfing
configuration sanity at runtime.

## EtcdConfig

Contains the fields and values loaded from etcd. If configured, the object will
be updated each time the etcd environment is changed. Linked to ConfigObject.

## FixedConfig

Contains the fixed fields and values listed in the 'value' section of the
configurations entry. Linked to ConfigObject.

## ContainerDetails

Holds details for building and publishing containers.

- registry: the name of the registry
- image: the name of the image.

## RpcDone

A callback model used inplace of the seneca callback to standardize return
codes.

```nodejs

function(done) {
    return {
        success: (result) => done(null, { 
            hasError: false,
            result: result
        }),

        error: (code, message) => done(null, {
            hasError: true,
            error: { code: code, message: message }
        }),

        badRequest: (message) => done(null, {
            hasError: true,
            error: { code: ERRINT_BAD_REQUEST, message: message }
        }),

        unauthorized: (message) => done(null, {
            hasError: true,
            error: { code: ERRINT_UNAUTHORIZED, message: message }
        }),

        forbidden: (message) => done(null, {
            hasError: true,
            error: { code: ERRINT_FORBIDDEN, message: message }
        }),

        notImplemented: (message) => done(null, {
            hasError: true,
            error: { code: ERRINT_NOT_IMPLEMENTED, message: message }
        }),

        notAvailable: (message) => done(null, {
            hasError: true,
            error: { code: ERRINT_NOT_AVAILABLE, message: message }
        }),

        internalError: () => done(null, {
            hasError: true,
            error: { code: ERRINT_INTERNAl_ERROR, message: message }
        })
    }
}

# Seneca Decorators

The following items will decorate the seneca context.

- addRpc: A method wrapper around seneca.add that modifies callback function to
  standardize return codes.
- connectClient: A method to start the seneca client.
- connectServer: A method to start the seneca server.
- etcd: The instance used by RpcFw to communicate with etcd2.
- serviceDiscription: Service description as defined in Service.yml
- configCollection: The configuration Collection fully populated with configs
  as defined in Service.yml

## addRpc

A method wrapper around seneca.add that modifies the callback function to
standarize the return model.

```nodejs
function(pattern, callback) {
    return seneca.add(pattern, (msg, done) => callback(msg, rpcDone(done)));
}

// Use the same as seneca.add
```
## ERRORS

Errors are all staticly defined variables located in src/errors.js Framework
errors start at 0xFFFF0000. Application error codes should be less then
0xFFFF0000.

- `ERRINT                 = 0xFFFF0000`
- `ERRINT_BAD_REQUEST     = ERRINT+1`
- `ERRINT_UNAUTHORIZED    = ERRINT+2`
- `ERRINT_FORBIDDEN       = ERRINT+3`
- `ERRINT_NOT_IMPLEMENTED = ERRINT+4`
- `ERRINT_NOT_AVAILABLE   = ERRINT+5`
- `ERRINT_INTERNAl_ERROR  = ERRINT+6`

src/errors.js also has a lookup method to find a error name by error number

```nodejs
function lookup(code) {
    for(var p in codes)
        if(codes[p] === code)
            return p;
}
```

One additional constant is a default exception method for internal error
responses.

- `ERRSTR_FAULT_MESSAGE` = "The service encountered an error and cannot continue. If the problem persists, please contact support."

The error module exports the following map.

```nodejs
{
    ERRINT:                 0xFFFF0000,
    ERRINT_BAD_REQUEST:     ERRINT+1,
    ERRINT_UNAUTHORIZED:    ERRINT+2,
    ERRINT_FORBIDDEN:       ERRINT+3,
    ERRINT_NOT_IMPLEMENTED: ERRINT+4,
    ERRINT_NOT_AVAILABLE:   ERRINT+5,
    ERRINT_INTERNAl_ERROR:  ERRINT+6,
    ERRSTR_FAULT_MESSAGE:   "The service encountered an error...",
    lookup:                 (code) => { ... }
}
```

## Helpers and methods.
use [object-path](https://www.npmjs.com/package/object-path). It does what we
need and we can use objectPath() to wrap msg in each request.
