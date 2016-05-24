import React from 'react';
import NewTask from './NewTask';
import Task from './Task';
import { Link } from 'react-router';
import { fetchTaskList as fetchTaskListAction } from '../actions/TaskListActions';

export default class TaskList extends React.Component {
  static contextTypes = {
    isBrowser: React.PropTypes.bool,
    hasLocalStorage: React.PropTypes.bool,
    user: React.PropTypes.object
  };

  static propTypes = {
    data: React.PropTypes.array.isRequired,
    filter: React.PropTypes.string
  };

  fetchTaskList() {
    fetchTaskListAction(this.context);
  }

  getAll() {
    return this.props.data.filter((task) => true);
  }

  getCompleted() {
    return this.props.data.filter((task) => task.completed);
  }

  getPending() {
    return this.props.data.filter((task) => !task.completed);
  }

  getFiltered(filter) {
    switch (filter) {
      case 'completed':
        return this.getCompleted();
      case 'pending':
        return this.getPending();
      default:
        return this.getAll();
    }
  }

  render() {
    const filter = this.props.filter ? this.props.filter : '';
    const tasks = this.getFiltered(filter).map((task) => {
      return (
        <Task id={task.id}
               title={task.title}
               order={task.order}
               completed={task.completed}
               key={task.id}/>
      );
    });

    const totalCount = this.props.data.length;
    const visibleCount = tasks.length;
    const tense = totalCount > 0 ? 'are' : 'will be';

    let loginLogout = null;
    let buttonFetch = null;

    if (this.context.user) {
      loginLogout = (
        <a href='/auth/logout'>Logout ({this.context.user.displayName})</a>
      );

      buttonFetch = (
        <button className='btn btn-default' onClick={this.fetchTaskList.bind(this)}>
          <span className='glyphicon glyphicon-refresh'></span> Fetch
        </button>
      );
    } else {
      loginLogout = (
        <p>
          <strong>Your tasks {tense} stored locally in your browser!</strong>
          <br/>
          <a href='/auth/facebook'>Login with Facebook</a> to save them remotely on our servers.
        </p>
      );
    }

    return (
      <div className='row'>
        <div className='col-xs-12 col-ms-10 col-ms-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3'>
          <div className='panel panel-default'>
            <div className='panel-heading'>
              <div className='row'>
                <div className='col-xs-12 col-sm-6'>
                  {buttonFetch}
                </div>
                <div className='col-xs-12 col-sm-6'>
                  <div className='btn-group' role='group'>
                    <Link className='btn btn-info' activeClassName='active' to='/'>All</Link>
                    <Link className='btn btn-success' activeClassName='active' to='/?filter=completed'>Completed</Link>
                    <Link className='btn btn-warning' activeClassName='active' to='/?filter=pending'>Pending</Link>
                  </div>
                </div>
              </div>
            </div>
              <ul className='list-group list-group-hover'>
                <NewTask />
                {tasks}
              </ul>
              <div className='panel-footer'>
                <div className='row'>
                  <div className='col-xs-8'>
                    {loginLogout}
                  </div>
                  <div className='col-xs-4 text-right'>
                    Showing: {visibleCount} of {totalCount}
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    );
  }
}
