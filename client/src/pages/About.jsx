import React from 'react';
import Header from '../componets/Header';

export default class About extends React.Component {
  render() {
    return (
      <div id='main'>
        <div className='jumbotron'>
          <Header title={'About'} description={'Example JavaScript Todo List application based on React and LoopBack'}/>
          <p>
            <a className='btn btn-lg btn-success' href='https://github.com/recallfx/todo-react-loopback'>
              Project on GitHub
            </a>
          </p>
        </div>
      </div>
    );
  }
}
