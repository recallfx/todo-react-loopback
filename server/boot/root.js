module.exports = function(server) {
  var renderApp = require('../../client/lib/app.server').default;
  var Task = server.models.task;

  // Install a `/` route that returns server status
  var router = server.loopback.Router();

  // /
  router.get('/', function (req, res, next) {
    // setup server context
    var serverContext = {
      user: null,
      url: req.url,
      data: []
    };

    if (req.user) {
      serverContext.user = {
        id: req.user.id,
        username: req.user.username,
        displayName: ''
      };

      // get display name
      if (req.user.profiles && req.user.profiles.length > 0) {
        serverContext.user.displayName = req.user.profiles[0].profile.displayName;
      }

      Task.find({
        where: {
          userId: req.user.id
        },
        order: 'order DESC'
      }, function (err, instances) {
        serverContext.data = instances;

        renderPage(res, serverContext);
      });
    }
    else {
      renderPage(res, serverContext);
    }
  });

  function renderPage(res, serverContext) {
    // render app with data
    var appHtml = renderApp(serverContext);

    // render page
    res.render('pages/index', {
      serverContext : serverContext,
      react: appHtml
    });
  }

  // /auth/logout
  router.get('/auth/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
  });

  // /auth/facebook
  // handled by passport

  // / status
  router.get('/status', server.loopback.status());

  server.use(router);
};
