import React from 'react';
import * as TaskListActions from '../actions/TaskListActions';

export default class NewTask extends React.Component {
  constructor() {
    super();

    this.state = {
      title: ''
    };
  }

  handleChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter' && e.target.value.length > 0) {
      TaskListActions.createTask(e.target.value, () => {
        this.setState({
          title: ''
        });
      });
    }
  }

  render() {
    return (
      <li className='list-group-item'>
        <div className='row'>
          <div className='col-xs-1'>
          </div>
          <div className='col-xs-10'>
            <input type='text'
                   name='title'
                   value={this.state.title}
                   className='form-control input-lg'
                   placeholder='Enter task text and press Enter'
                   onChange={this.handleChangeTitle.bind(this)}
                   onKeyPress={this.handleKeyPress.bind(this)}
              />
          </div>
        </div>
      </li>
    );
  }
}
