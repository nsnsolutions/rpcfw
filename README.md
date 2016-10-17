# RpcFW

Remote Procedure Call Framework built on senecajs, rabbitmq, and etcd.

## Quickstart

Install rpcfw globally

`npm install -g git://github.com/nsnsolutions/rpcfw.git`

Create a new project from templates.

`rpcfw init ~/toNewProject`

Go to your new project directory and launch the new service.

`rpcfw run --debug Service.yml`

You are ready to start building your service.

## Application Entrypoing

RpcFW will load initialize the environment accourding to the configuration
specified in the Service.yml. Once that environment is ready, it will call your
application entry point. RpcFW expects a function that accepts the AppContext
constructor. This can be used to bootstrap your service or client.

The appContext constructor already has the service yaml settings applied. It
needs to be bound to your plugins and started. The constructor should be
executed as follows.

`var app = appContext({ ... })`

Params:
- onConfigUpdate: Called each time a etcd config change is fired. `function(name, conf)`
- onStart: Called each time app.start is executed. `function(bus, confs)`
- onRestart: Called each time app.restart is executed. `function(bus, confs)`
- onShutdown: Called each time app.Shutdown is executed. `function(bus, confs)`

This constructor returns a appContext object that can be used to start your
service. That appContext has the following methods.

- start(): Will start the framework and call onStart callback.
- restart(): Will shutdown the framework, restart it and call onRestart callback.
- shutdown(): Will shutdown the framework and call the onShutdown callback.

Example:

This example will expose a two method calls. _hello_ that simply response with
"Hello". And _exit_ that will shutdown the server.  It will also restart the
server if any configurations change.

```javascript
module.exports = function(AppContext) {
    var app = AppContext({
        onStart: (b, c) => install(b,c),
        onRestart: (b, c) => install(b,c),
        onShutdown: () => process.exit(0),
        onConfigUpdate: () => app.restart()
    })

    .start();

    function install(bus, config) {
        bus.rpcAdd('role:MyService,cmd:hello', (m, d) => d.success("Hello"));
        bus.rpcAdd('role:MyService,cmd:exit', (m, d) => {
            d.success("ok");
            app.shutdown();
        });
        bus.rpcServer({ pin: "role:MyService" });
    }
};

```

## Seneca Decorators

RpcFW Addes decorators to the seneca object that is passed to the app on
startup and restartup. These decorators can be called at any time, even within
your seneca plugins.

### rpcAdd

`bus.rpcAdd(PATTERN, CALLBACK)`

Expose CALLBACK as rpc function as PATTERN. See [seneca
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

## Service.yml

The service yml holds metadata about the service. It tells the framework what
configurations to load from etcd, where the entry point is, what queue names to
build on the service bus and so on.

This data can be stored in any file as long as it is either in Json or Yaml
format. If you would like, you can store this data in package.json. Extra 
information will not cause any issues.

### Required Fields

- name: The name of the service.
- verson: A symantic style version number. Example 1.2.3 (notice the lack of _v_)
- description: A description of your service.
- main: The service entry point that exposes the main function.
- configurations: A list of configuration entries. _See below_
- container:
  - image: The name of the docker image. In AWS, this should be the ecr registry name.
  - registry: The url of the docker registry. In AWS, this should be the ecr registry Hostname.

#### Configurations

The configurations is a list config entries. They tell rpcfw where to load
configs from.

There are 2 times of config entries.
- EtcdConfig: Parses a etcd directory tree and loads it as the config.
- FixedConfig: An literal configuration passed in through the config.

##### EtcdConfig Entry

The EtcdCofnig Entry will load the etcd directory tree located at _key_ and
parse it into a javascript object and attach it to _name_ on the service
configuration object that is passed to the main method.

- name: The field name to attach the config to after load.
- key: The etcd directory location.
- watch: Optional, watch etcd for changes and load them into the object if they do. This
  will cause _onConfigUpdate_ to fire. Default: False.
- recursive: Optional, load the etcd tree recursivly. Default: True.
- debounce: Optional, The amount of time, in miliseconds, to wait before
  calling the onChanged callback.

##### FixedConfig Entry

The FixedConfig entry will load the liternal value as the config.

- name: The field name to attach the config to after load.
- value: A json object containing the literal configuration to attach.

# Internal API Documentation

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

### ContainerDescription

An object holding the details about where the docker image is associated.

#### Members

__Constructor__

`containerDescription(ENTRY)`

Create a new containerDescription object from the given ENTRY.

args:
- ENTRY: 
 - registry: Optional, a docker registry uri.
 - image: The name of the image to assocaite this service with.

__registry__

`var n = o.registry`

A docker registry URI. Currently this really only applies to a aws ECR image.

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
