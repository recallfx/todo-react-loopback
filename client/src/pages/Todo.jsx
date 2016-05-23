import React from 'react';
import Header from '../componets/Header';
import TaskList from '../componets/TaskList';
import taskListStore from '../stores/TaskListStore';

export default class Todo extends React.Component {
  static propTypes = {
    location: React.PropTypes.object,
    router: React.PropTypes.object,
    route: React.PropTypes.object
  };

  constructor() {
    super();

    this.updateTaskList = this.updateTaskList.bind(this);

    this.state = {
      title: 'Todo list',
      description: 'Example JavaScript Todo List application based on React and LoopBack',
      taskList: []
    };
  }

  componentWillMount() {
    taskListStore.on('change', this.updateTaskList);

    // emit event for initial render
    taskListStore.emit('change');
  }

  componentWillUnmount() {
    taskListStore.removeListener('change', this.updateTaskList);
  }

  updateTaskList() {
    this.setState({
      taskList: taskListStore.getAll()
    });
  }

  render() {
    return (
      <div id='main'>
        <Header title={this.state.title} description={this.state.description}/>
        <TaskList data={this.state.taskList} location={this.props.location} />
      </div>
    );
  }
}
