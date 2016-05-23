import config from '../Config';
import dispatcher from '../Dispatcher';
import Constants from '../Constants';
import axios from 'axios';

/*
 * Private functions
 * */

/**
 Delete task from server if mode is not browser and user is logged in

 @param {object} axiosConfig
 @param {Function} [cb] Callback function to call after successful request
 */
const _persistRemote = function (axiosConfig, cb) {
  dispatcher.dispatch({ type: Constants.Actions.Ajax.PERSIST_START });

  // Send a POST request
  axios(axiosConfig)
    .then((response) => {
      dispatcher.dispatch({ type: Constants.Actions.Ajax.PERSIST_END, response: response });

      if (cb) cb(response.data);
    })
    .catch((response) => {
      dispatcher.dispatch({ type: Constants.Actions.Ajax.PERSIST_ERROR, response: response });
    });
};

/**
 Delete task from server if mode is not browser and user is logged in

 @param {string} id Task ID on server DB
 @param {Function} [cb] Callback function to call after successful request
 */
const _deleteRemote = function (id, cb) {
  if (config.isBrowser && config.user && id) {
    _persistRemote({
      method: 'delete',
      url: '/api/users/' + config.user.id + '/tasks/' + id
    }, cb);
  } else {
    if (cb) cb();
  }
};

/**
 Update task to the server DB if mode is not browser and user is logged in

 @param {string} id
 @param {object} data Task data to send to server (upsert)
 @param {Function} [cb(task)] Callback function to call after successful request
 */
const _updateRemote = function (id, data, cb) {
  // send single task to server
  if (config.isBrowser && config.user && data && id) {
    _persistRemote({
      method: 'put',
      url: '/api/users/' + config.user.id + '/tasks/' + id,
      data: data
    }, cb);
  } else {
    if (cb) cb();
  }
};

/*
 * Exported functions
 * */
/**
 Insert new task to the server DB if mode is not browser and user is logged in

 @param {object} data Task data to send to server (upsert)
 @param {Function} [cb(task)] Callback function to call after successful request
 */
export function createRemote(data, cb) {
  // send single task to server
  if (config.isBrowser && config.user && data) {
    _persistRemote({
      method: 'post',
      url: '/api/users/' + config.user.id + '/tasks',
      data: data
    }, cb);
  } else {
    if (cb) cb(data);
  }
}

export function fetchTaskList() {
  if (config.user) {
    dispatcher.dispatch({ type: Constants.Actions.Ajax.FETCH_START });

    axios.get('/api/users/' + config.user.id + '/tasks')
      .then((response) => {
        dispatcher.dispatch({ type: Constants.Actions.Ajax.FETCH_END, data: response.data, response: response });
      })
      .catch((response) => {
        dispatcher.dispatch({ type: Constants.Actions.Ajax.FETCH_ERROR, data: [], response: response });
      });
  }
}

/*
 * Local methods
 * */
export function createTask(text, cb) {
  const tmpId = Date.now() + text;
  const taskNew = {
    title: text,
    order: tmpId,
    completed: false
  };

  // if user not logged in, create temporary id
  if (config.isBrowser && !config.user) {
    taskNew.id = tmpId;
  }

  createRemote(taskNew, (task) => {
    if (cb) cb();

    dispatcher.dispatch({ type: Constants.Actions.TaskListStore.CREATE, task: task });
  });
}

export function updateTask(id, task) {
  _updateRemote(id, task, () => {
    dispatcher.dispatch({ type: Constants.Actions.TaskListStore.UPDATE, id: id, task: task });
  });
}

export function deleteTask(id) {
  _deleteRemote(id, () => {
    dispatcher.dispatch({ type: Constants.Actions.TaskListStore.DELETE, id: id });
  });
}
