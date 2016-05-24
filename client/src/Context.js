export default class Context {
  hasLocalStorage = false;
  isBrowser = false;
  data = [];
  user = null;

  constructor() {
    // check if browser
    // http://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
    // eslint-disable-next-line no-new-func
    const testIfBrowser = new Function('try {return this===window;}catch(e){ return false;}');

    if (testIfBrowser()) {
      this.isBrowser = true;

      // eslint-disable-next-line no-undef
      if (window.serverContext) {
        // eslint-disable-next-line no-undef
        this.setAll(window.serverContext);
      } else {
        throw new Error('Missing window.serverContext in browser mode.');
      }

      // check if browser has local storage
      if (typeof (Storage) !== 'undefined') {
        this.hasLocalStorage = true;
      }
    }
  }

  setAll(context) {
    this.data = context.data ? context.data : [];
    this.user = context.user ? context.user : null;
  }
}
