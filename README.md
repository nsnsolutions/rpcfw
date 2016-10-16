# RpcFW

Remote Procedure Call Framework built on senecajs, rabbitmq, and etcd.

## Types

RpcFW uses the parasitic inheritance pattern. Keep in mind that this approach
can mask members on objects if you use a name that is already used as a member
name in the subclass. Please note the member names in each section.

### VerifiableObject

It is a natural side effect of RPC that we cannot trust endpoints to send our
services properly formatted data. We have no compiler or pre-processing to
validate these signatures against invocation expressions. 

Because of this RpcFW provides the `verifiableObject` object provides methods
to simplify validation. It is used for incoming message requests as well as
configuration loading. It is also exposed if you would like to make further use
of it for return data from other services.

#### Members

__Constructor__

`verifiableObject(OBJ)`

Create new linked object from OBJ and extend it with [Members].

__assertMember__

Throw an error if the field or path does not exist and is not a specific type (optional).

`o.assertMember(PATH, TYPE)`

args: 

- PATH: A path that represents where in the context to look. Example: "item1.item2"
- TYPE: A javascript Type method. One of: String, Number, Boolean, Object, Array (Optional)

__ensureExists__

Set a default value on the field or path if no value is set.                                     |

`o.ensureExists(PATH, VALUE)`

args: 

- PATH: A path that represents where in the context to set. Example: "item1.item2"
- VALUE: The value to set if the path has no value.

__get__

Get the value stored in the field or path on the current context.                                |

`o.get(PATH, VALUE)`

args: 

- PATH: A path that represents where in the context to get. Example: "item1.item2"
- VALUE: The value to get if the path has no value. (optional)

__set__

Set the field or path on the current context.                                                    |

`o.set(PATH, VALUE)`

args: 

- PATH: A path that represents where in the context to set. Example: "item1.item2"
- VALUE: The value to set on the path. This will over write exsting values.

__has__

Check for the existance of a field or path of a specific type (optional) on the current context. |

`o.has(PATH, TYPE)`

args:

- PATH: A path that represents where in the context to check. Example: "item1.item2"
- TYPE: A javascript Type method. One of: String, Number, Boolean, Object, Array (Optional)

__raw__

`o.raw`

Property that returns the raw, unlinked object used to initialize the verifiableObject           |

#### Examples

```javascript
const rpcfw = require('rpcfw');

var o = rpcfw.verifiableObject({
    item1: "Item 1",
    item2: 2,
    item3: { item4: true }
});

o.assertMember("item3.item4") // pases
o.assertMember("item3.item4", Boolean) // pases
o.assertMember("item3.item4", Number) // Throws UnexpectedTypeError
o.assertMember("no.exist", Number) // Throws MemberNotFoundError

o.ensureExists("item0", "Will create and set item0 field");
o.ensureExists("item1", "Will do nothing because item1 has a value.");

o.has("item3.item4") // returns True
o.has("item3.item4", Boolean) // returns true
o.has("item3.item4", Number) // returns false

o.get("item3.item4") // returns the value stored in o.item3.item4. (true)
o.get("no.exist", "defaultValue") // returns "defaultValue"

o.set("item3.new", "will create item3.new")
o.set("item3.item4", "Will set a new value on item3.item4")

```

### FixedConfig

Fixed config is a constructor to turn a configuration collection entry into a
verifiableObject. This object has no specific members other then those defined
in verifiableObject.

#### Members

__Constructor__

`fixedConfig(ENTRY)`

Create new linked object from ENTRY.value and extend it with [Members].

args:
- ENTRY: An object defining the name and value of the static config.
 - name: The name of the config (used in error assertion).
 - value: the static object with the values.

### EtcdConfig

Etcd config reads a etcd2 node and maps it to a verifiableObject. It can
optionaly watch for changes and invoke a _onUpdate_ callback. 

#### Members

__Constructor__

`etcdConfig(ENTRY, ETCD)`

Create a new linked object from the etcd2 node identified in ENTRY.key and
extend it as a verifiableObject. Optionally, set up a watcher that will update
the resulting verifiableObject and execute the given callback.

Args:
- ENTRY: An object defining a name and etcd2 key to load.
 - name: A user friendly name (used in error assertion).
 - key: The etcd2 key to load.
 - watch: Optional, Watch etcd2 for changes. Default: false.
 - recursive: Optional, Load the etcd2 node recursivly. Default: true.
 - debounce: The ammount of time to wait between seeing a change in etcd and invoking the onUpdate callback.
- ETCD: A reference to a connected node-etcd client object.

__onUpdate__

`o.onUpdate = function(CONF) { ... }`

The onUpdate callback is invoked each time any of the watched etecd nodes for
this config change. The invoked function will be given a refrence to the
etcdConfig object.

### ServiceDescription

A object containing some metadata about the service.

#### Members

__Constructor__

`serviceDescription(ENTRY)`

Create a new service description object with the given metadata.

args:
- ENTRY: 
 - name: The name of the service.
 - description: A description of the service.
 - version: A symatic style version number. Example: 1.0.0 (note the absense of 'v')

__name__

`var n = o.name`

Name is a property that represents the name of the service.

__description__

`var n = o.description`

The description of the service.

__version__

`var n = o.version`

The version of the service split into a map.

Returns:
- major: The major version
- minor: The minor version
- patch: The patch version
- toString: The reassembled version as a string. Ie: 1.0.0

__toString__

`var n = o.toString()`

Create a friendly name for the service. "Name v1.0.1"

__isValid__

`if(o.isValid()) {}`

Check the object for a valid name and version.

### ContainerDetails

An object holding the details about where the docker image is associated.

#### Members

__Constructor__

`containerDetails(ENTRY)`

Create a new containerDetails object from the given ENTRY.

args:
- ENTRY: 
 - registry: Optional, a docker registry uri.
 - image: The name of the image to assocaite this service with.

__registry__

`var n = o.registry`

A docker registry URI.

__image__

`var n = o.image`

The name of the image to assocaite this service with.

__toString__

`var n = o.toString(TAG)`

Returns the name of the image as docker would see it. 

args:
- TAG: Optional, Produce the output with a given tag.

__isValid__

`if(o.isValid()) {}`

Check the object for a valid image name.

### Errors

A singleton that can be used to lookup and produce error codes.

#### Members

__lookup__

`o.lookup(CODE)`

Lookup the label of an error by a code.

args:
- code: an integer representing a error code. If not found, response is undefined.

__isBuiltin__

`o.isBuiltin(CODE)`

Lookup the label of an error by a code.

args:
- code: an integer representing a error code. If not found, response is undefined.

__Codes__

Builtin codes start at 0xFFFF0000 and go up from there.

| Label                    | Value      | Description                                                                                                             |
| ------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| `ERRINT_BAD_REQUEST`     | 0xFFFF0001 | Should be returned by service if there is incorrect or insufficient information in the request.                         |
| `ERRINT_NOT_AUTHORIZED`    | 0xFFFF0002 | Should be returned by service if the current user context does not have the authority to perform the requested action.  |
| `ERRINT_FORBIDDEN`       | 0xFFFF0003 | Should be returned by service if the current user context is unknown but required.                                      |
| `ERRINT_NOT_IMPLEMENTED` | 0xFFFF0004 | Should be returned by service if the requested method or action is not implemented.                                     |
| `ERRINT_NOT_AVAILABLE`   | 0xFFFF0005 | Should be returned by service if the request cannot be completed due to missing or non responding dependent service.    |
| `ERRINT_INTERNAl_ERROR`  | 0xFFFF0006 | Should be returned by service for un-handled errors.                                                                    |

### ServiceConfiguration

Object holding all the settings from the config file.

#### Members

__Constructor__

TODO

### appFactory

Create a application constructor bassed on a ServiceConfiguration. This
constructure also has members for retrieveing data passed into the factory. All
these values are readonly getters. See members for more details.

#### Members

__constructor__

`var app = appContextFromAppFactory(OPTS)`

Create a new appContext bound by the settings applied to the appFactory.

Args:
- OPTS:
 - onStart: A function to execute when the appContext is started.
 - onRestart: A function to execute when the appContext is restarted.
 - onConfigUpdate: Optional, a function to execute when a etcd configuration changes.
 - onShutdown: Optional, a function to execute when appContext is shutdown.

Returns: 
- [appContext]

__etcd__

A getter that returns the connected etcd instance that was used to load configs
and other service disovery things. see
[node-etcd](https://www.npmjs.com/package/node-etcd) for more info.

__isInDebugMode__

A getter that returns the run state. If debug is enabled, the appContext will
not connect to rmq. Look at the lib/plugins/seneca-rpcfw.js for details.

__serviceDescription__

A getter that returns the serviceDescription as loaded by serviceConfiguration.

__logLevel__

A getter that return the logLevel currently applied to the running instance.

__configurations__

A getter that returns the loadded configurations loaded by
serviceConfiguration.

### appContext

The appContext is used to control the execution state of the current
service/client. It acts as the glue layer between the frameowk and the user's
solution. Use appFactory to create a suitable constructor for execution.

#### Members

__constructor__

The construtor should only be called as returned by the appFactory.

__start__

`appContext.start()`

Connects the framework to the rpc bus and installs framework plugins. Once
complete, calls Restart.

__restart__

`appContext.restart()`

Shutdowns the existing connection to the rpc bus and re-initializes the
framework. This is very usefull to call if a service wants to reload it's
configurations. Once complete, calls onRestart.

__shutdown__

`appContext.shutdown()`

Shutdown the existing connection to the rpc bus and dispose the framework
configuration. Once complete, calls onShutdown. It is the responsability of the
solution to exit the process.

## Seneca Decorators

RpcFW Addes decorators to the seneca object that is passed to the app on
startup and restartup.  These decorators can be called at any time, even within
your seneca plugins.

### rpcAdd

`bus.rpcAdd(PATTERN, CALLBACK)`

Expose CALLBACK as a rpc function as PATTERN. See [seneca
add](http://senecajs.org/api/#add-pattern-spec-handler-this) documentation for
more detail on pattern.

CALLBACK should be a function that excepts 2 arguments.

`function CALLBACK(MSG, RESP) { ... }`

Params:
- MSG: The request from seneca wrapped as a verifiabeObject.
- RESP: A rpcDone object used to respond to the request.

### rpcClient

`bus.rpcClient({pin: 'role:*'});`

Connect to the rpc bus as a client.

### rpcServer

`bus.rpcServer({pin: 'role:YourService'});`

Connect to the rpc bus as a server.

---




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

module.exports = function(app) {

    /* Do setup things. */

    app.initialize({

        /* Called when etcdConfig sees a change. */
        onConfigUpdate: onUpdate

        /* Called the first time the service is started */
        onStart: install,

        /* Called each time the service is restarted by seneca.restart() */
        onRestart: reInstall

    })

    app.start();

    // ------------------------------------------------------------------------

    function onUpdate(name, conf) {
        /* A change was made on one of the etcd configs. */ 
        if(name === 'someConfigName')
            this.restart();
    }

    function install(bus) {
        /* install/reinstall services, start client/server */ 
        this.ready( () => { /** access to all seneca things */ } )
        this.use('myPlugin');

        this.rpcClient();
        this.rpcServer();
    }

    function reInstall() {
        /* Do some app level restart like close express or whatever */
        install.call(this);
    }
}
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

        notAuthorized: (message) => done(null, {
            hasError: true,
            error: { code: ERRINT_NOT_AUTHORIZED, message: message }
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
- `ERRINT_NOT_AUTHORIZED    = ERRINT+2`
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
    ERRINT_NOT_AUTHORIZED:    ERRINT+2,
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
