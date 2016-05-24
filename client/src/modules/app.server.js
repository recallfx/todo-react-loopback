import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Layout from './../componets/Layout';
import PageTodo from './../pages/Todo';

/**
 Server rendering function

 @param {object} serverContext Pass server context, that otherwise would be window.serverContext
 */
export default function renderApp(serverContext) {
  return ReactDOMServer.renderToString(
    <Layout>
      <PageTodo serverContext={serverContext} />
    </Layout>
  );
}
