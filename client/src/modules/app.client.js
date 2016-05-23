import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './../componets/Layout';
import PageAbout from './../pages/About';
import PageTodo from './../pages/Todo';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';

window.onload = () => {
  const app = document.querySelector('#container');

  // This removes _k=xxxx from the query. This is instead of hashHistory from react-router
  const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

  ReactDOM.render(
    <Router history={appHistory}>
      <Route path='/' component={Layout}>
        <IndexRoute component={PageTodo} />
        <Route path='about' name='about' component={PageAbout} />
      </Route>
    </Router>,
    app
  );
};
