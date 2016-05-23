var React = require('react');
var ReactDOMServer = require('react-dom/server');

import config from '../Config';
import Layout from './../componets/Layout';
import PageTodo from './../pages/Todo';

export function renderApp(serverContext) {
  if (serverContext) {
    config.user = serverContext.user ? serverContext.user : null;
    config.data = serverContext.data ? serverContext.data : [];
  } else {
    throw new Error('Parameter serverContext in server mode was not set.');
  }

  return ReactDOMServer.renderToString(
    <Layout>
      <PageTodo />
    </Layout>
  );
}
