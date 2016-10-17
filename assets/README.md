# RCP {{ SERVICE_NAME }}

{{ SERVICE_DESCRIPTION }}

## Quick Start

- Install packages
- Optionally install nodemon for automatic restarting.
- Run as debug.

```bash
npm install
npm install -g nodemon
nodemon --exec "rpcfw run --discovery-uri etcd.local:2379 --debug Service.yml"
```

If you do not want to use nodemon:

```bash
npm install
rpcfw run --discovery-uri etcd.local:2379 --debug Service.yml
```
