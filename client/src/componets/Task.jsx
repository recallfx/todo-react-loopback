import React from 'react';
import * as TaskListActions from '../actions/TaskListActions';

export default class Task extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    order: React.PropTypes.string.isRequired,
    completed: React.PropTypes.bool.isRequired
  };

  static defaultProps = {
    id: '',
    title: '',
    order: '',
    completed: false
  };

  handleChangeCompleted(e) {
    TaskListActions.updateTask(this.props.id, {completed: e.target.checked});
  }

  handleChangeTitle(e) {
    TaskListActions.updateTask(this.props.id, {title: e.target.value});
  }

  deleteTask() {
    TaskListActions.deleteTask(this.props.id);
  }

  render() {
    return (
      <li className='list-group-item'>
        <div className='row'>
          <div className='col-xs-1 col-sm-1'>
            <div className='checkbox'>
              <label>
                <input type='checkbox'
                       name='done'
                       checked={this.props.completed}
                       onChange={this.handleChangeCompleted.bind(this)} />
              </label>
            </div>
          </div>
          <div className='col-xs-10 col-sm-10'>
            <input type='text'
                   name='title'
                   value={this.props.title}
                   className='form-control'
                   onChange={this.handleChangeTitle.bind(this)} />
          </div>
          <div className='hover-btn pull-right'>
            <button className='item-remove btn btn-default btn-xs' onClick={this.deleteTask.bind(this)}>
              <span className='glyphicon glyphicon-trash'></span>
            </button>
          </div>
        </div>
      </li>
    );
  }
}
