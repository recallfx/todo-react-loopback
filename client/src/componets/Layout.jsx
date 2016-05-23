import React from 'react';
import Nav from './Nav';

export default class Layout extends React.Component {
  static propTypes = {
    children: React.PropTypes.object
  };

  render() {
    return (
      <section className='container'>
        <Nav />
        {this.props.children}
      </section>
    );
  }
}

