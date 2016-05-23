import React from 'react';
import Title from '../componets/Title';

export default class Header extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    description: React.PropTypes.string
  };

  render() {
    const descComponent = this.props.description !== '' ? <p>{this.props.description}</p> : null;

    return (
      <header>
        <Title title={this.props.title}/>
        { descComponent }
      </header>
    );
  }
}
