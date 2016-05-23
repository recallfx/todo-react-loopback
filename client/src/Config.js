let instance = null;

class Config {
  hasLocalStorage = false;
  isBrowser = false;
  user = null;
  data = null;

  constructor() {
    if (!instance) {
      instance = this;

      // check if browser
      // http://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
      // eslint-disable-next-line no-new-func
      const testIfBrowser = new Function('try {return this===window;}catch(e){ return false;}');

      if (testIfBrowser()) {
        window.clientContext = this;
        this.isBrowser = true;

        const serverContext = window.serverContext;

        if (serverContext) {
          this.user = serverContext.user ? serverContext.user : null;
          this.data = serverContext.data = serverContext.data ? serverContext.data : [];
        } else {
          throw new Error('Missing window.serverContext in browser mode.');
        }

        // check if browser has local storage
        if (typeof (Storage) !== 'undefined') {
          this.hasLocalStorage = true;
        }
      }
    }

    return instance;
  }
}

export default new Config();
