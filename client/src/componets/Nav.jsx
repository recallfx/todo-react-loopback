import React from 'react';
import { IndexLink, Link } from 'react-router';

export default class Nav extends React.Component {
  render() {
    return (
      <div className='navbar navbar-default navbar-fixed-top'>
        <div className='navbar-header'>
          <Link to='/' className='navbar-brand'>Todo</Link>
        </div>
        <div className='navbar-collapse' id='navbar-main'>
          <ul className='nav navbar-nav navbar-right'>
            <li><IndexLink to='/' activeClassName='active'>Todo list</IndexLink></li>
            <li><Link to='/about' activeClassName='active'>About</Link></li>
          </ul>
        </div>
      </div>
    );
  }
}
