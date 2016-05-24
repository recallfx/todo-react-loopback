import { EventEmitter} from 'events';
import { find, findIndex, assign } from 'lodash';
import Context from '../Context';
import dispatcher from '../Dispatcher';
import Constants from '../Constants';
import { createRemote } from '../actions/TaskListActions';

// private functions
const trySavingLocalStorage = function (context, taskList) {
  // try saving to local storage only for users who has not logged in
  // and only in browsers with local storage support
  if (context.isBrowser && context.hasLocalStorage && !context.user) {
    if (taskList) {
      // save to local store
      localStorage.setItem(Constants.Defaults.TASK_LIST_KEY, JSON.stringify(taskList));
    } else {
      // remove key from local storage
      localStorage.removeItem(Constants.Defaults.TASK_LIST_KEY);
    }
  }
};

const tryLoadingLocalStorage = function (context, data) {
  let result = data ? data : [];

  if (context.isBrowser && context.hasLocalStorage) {
    const localDataString = localStorage.getItem(Constants.Defaults.TASK_LIST_KEY);

    // check if local storage has any saved tasks
    if (localDataString && localDataString !== '') {
      let localData = JSON.parse(localDataString);

      // persist on server if user connected
      if (context.user) {
        let savedTasks = [];

        localData.forEach((localTask) => {
          if (localTask && localTask.title) {
            // remove temporary id
            delete localTask.id;

            createRemote(context, localTask, (remoteTask) => {
              savedTasks.push(remoteTask);
            });
          }
        });

        if (savedTasks.length > 0) {
          // remove local data
          localStorage.removeItem(Constants.Defaults.TASK_LIST_KEY);

          // add them to already received data
          result = result.concat(savedTasks);
        }
      }
    }
  }

  return result;
};

/*
 * TaskListStore - STORE part of Flux pattern
 * */
class TaskListStore extends EventEmitter {
  constructor() {
    super();

    this.context = new Context();

    this.taskList = null;
  }

  initTaskList(data) {
    // if task list is not initialised, try adding config data and local storage
    if (this.taskList === null) {
      this.taskList = tryLoadingLocalStorage(this.context, data);
    }
  }

  create(task) {
    this.taskList.push(task);

    trySavingLocalStorage(this.context, this.taskList);

    if (this.context.isBrowser) {
      this.emit('change');
    }
  }

  updateById(id, updatedTask) {
    let task = find(this.taskList, (task) => task.id === id);

    assign(task, updatedTask);

    trySavingLocalStorage(this.context, this.taskList);

    if (this.context.isBrowser) {
      this.emit('change');
    }
  }

  deleteById(id) {
    const index = findIndex(this.taskList, (task) => task.id === id);

    if (index > -1) {
      this.taskList.splice(index, 1);

      trySavingLocalStorage(this.context, this.taskList);

      if (this.context.isBrowser) {
        this.emit('change');
      }
    }
  }

  setAll(data) {
    this.taskList = data;

    trySavingLocalStorage(this.context, this.taskList);

    if (this.context.isBrowser) {
      this.emit('change');
    }
  }

  getAll() {
    return this.taskList.sort((a, b) => b.order.localeCompare(a.order));
  }

  /*
   * Handle dispatcher actions
   * */
  handleActions(action) {
    switch (action.type) {
      case Constants.Actions.TaskListStore.CREATE:
        this.create(action.task);
        break;
      case Constants.Actions.TaskListStore.UPDATE:
        this.updateById(action.id, action.task);
        break;
      case Constants.Actions.TaskListStore.DELETE:
        this.deleteById(action.id);
        break;

      case Constants.Actions.Ajax.FETCH_END:
        this.setAll(action.data);
        break;
    }
  }
}

const taskListStore = new TaskListStore();

dispatcher.register(taskListStore.handleActions.bind(taskListStore));

export default taskListStore;
