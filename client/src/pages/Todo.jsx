import React from 'react';
import Header from '../componets/Header';
import TaskList from '../componets/TaskList';
import taskListStore from '../stores/TaskListStore';
import Context from '../Context';

export default class Todo extends React.Component {
  static childContextTypes = {
    isBrowser: React.PropTypes.bool,
    hasLocalStorage: React.PropTypes.bool,
    user: React.PropTypes.object,
    data: React.PropTypes.array
  };

  static propTypes = {
    serverContext: React.PropTypes.object,
    location: React.PropTypes.object,
    router: React.PropTypes.object,
    route: React.PropTypes.object
  };

  constructor() {
    super();

    this.updateTaskList = this.updateTaskList.bind(this);

    const ctx = new Context();

    this.state = {
      // context
      isBrowser: ctx.isBrowser,
      hasLocalStorage: ctx.hasLocalStorage,
      user: ctx.user,
      data: ctx.data,

      // component state
      title: 'Todo list',
      description: 'Example JavaScript Todo List application based on React and LoopBack',
      taskList: []
    };
  }

  getChildContext() {
    return {
      isBrowser: this.state.isBrowser,
      hasLocalStorage: this.state.hasLocalStorage,
      user: this.state.user,
      data: this.state.data
    };
  }

  componentWillMount() {
    if (this.state.isBrowser) {
      // use events only in browser mode
      taskListStore.on('change', this.updateTaskList);

      taskListStore.initTaskList(this.state.data);
      taskListStore.emit('change');
    } else {
      this.setState({
        user: this.props.serverContext.user,
        data: this.props.serverContext.data
      });

      taskListStore.initTaskList(this.props.serverContext.data);
    }
  }

  componentWillUnmount() {
    if (this.state.isBrowser) {
      taskListStore.removeListener('change', this.updateTaskList);
    }
  }

  updateTaskList() {
    this.setState({
      taskList: taskListStore.getAll()
    });
  }

  render() {
    const filter = this.props.location ? this.props.location.query.filter : '';

    return (
      <div id='main'>
        <Header title={this.state.title} description={this.state.description}/>
        <TaskList data={this.state.taskList} filter={filter} />
      </div>
    );
  }
}
