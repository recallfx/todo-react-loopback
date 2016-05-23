# todo-react-loopback

Example Todo list application based on React and LoopBack

## Global dependencies

```
$ npm install -g strongloop webpack
```

## Setup dependencies

````
$ npm install
```

### Build sources

```
$ WEBPACK_ENV=build webpack
```

### Server

Development: `$ node .`, production: `$ NODE_ENV=production pm2 start . --name="todo"`.
