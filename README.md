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

### Setup providers.json

Create `providers.json` file with content:

```
{
  "facebook-login": {
    "provider": "facebook",
    "module": "passport-facebook",
    "clientID": "<your fb client id>",
    "clientSecret": "<your fb client secret>",
    "callbackURL": "/auth/facebook/callback",
    "authPath": "/auth/facebook",
    "callbackPath": "/auth/facebook/callback",
    "successRedirect": "/#/",
    "failureRedirect": "/#/auth_failed",
    "scope": ["email"],
    "failureFlash": true
  }
}
```

### Server

Development: `$ node .`, production: `$ NODE_ENV=production pm2 start . --name="todo"`.
