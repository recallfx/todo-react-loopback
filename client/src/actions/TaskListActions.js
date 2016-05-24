import dispatcher from '../Dispatcher';
import Constants from '../Constants';
import axios from 'axios';
import { debounce } from 'lodash';

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

 @param {object} context
 @param {string} id Task ID on server DB
 @param {Function} [cb] Callback function to call after successful request
 */
const _deleteRemote = function (context, id, cb) {
  if (context.isBrowser && context.user && id) {
    _persistRemote({
      method: 'delete',
      url: '/api/users/' + context.user.id + '/tasks/' + id
    }, cb);
  } else {
    if (cb) cb();
  }
};

/**
 Update task to the server DB if mode is not browser and user is logged in

 @param {object} context
 @param {string} id
 @param {object} data Task data to send to server (upsert)
 @param {Function} [cb(task)] Callback function to call after successful request
 */
const _updateRemote = function (context, id, data, cb) {
  // send single task to server
  if (context.isBrowser && context.user && data && id) {
    _persistRemote({
      method: 'put',
      url: '/api/users/' + context.user.id + '/tasks/' + id,
      data: data
    }, cb);
  } else {
    if (cb) cb();
  }
};

const _debouncedUpdateRemote = debounce(_updateRemote, 200);

/*
 * Exported functions
 * */
/**
 Insert new task to the server DB if mode is not browser and user is logged in

 @param {object} context
 @param {object} data Task data to send to server (upsert)
 @param {Function} [cb(task)] Callback function to call after successful request
 */
export function createRemote(context, data, cb) {
  // send single task to server
  if (context.isBrowser && context.user && data) {
    _persistRemote({
      method: 'post',
      url: '/api/users/' + context.user.id + '/tasks',
      data: data
    }, cb);
  } else {
    if (cb) cb(data);
  }
}

export function fetchTaskList(context) {
  if (context.user) {
    dispatcher.dispatch({ type: Constants.Actions.Ajax.FETCH_START });

    axios.get('/api/users/' + context.user.id + '/tasks')
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
export function createTask(context, text, cb) {
  const tmpId = Date.now() + text;
  const taskNew = {
    title: text,
    order: tmpId,
    completed: false
  };

  // if user not logged in, create temporary id
  if (context.isBrowser && !context.user) {
    taskNew.id = tmpId;
  }

  createRemote(context, taskNew, (task) => {
    if (cb) cb();

    // create only if server request was success
    dispatcher.dispatch({ type: Constants.Actions.TaskListStore.CREATE, task: task });
  });
}

export function updateTask(context, id, task) {
  // debounce remote request
  _debouncedUpdateRemote(context, id, task);

  // immediately dispatch task change to update input value
  dispatcher.dispatch({ type: Constants.Actions.TaskListStore.UPDATE, id: id, task: task });
}

export function deleteTask(context, id) {
  _deleteRemote(context, id, () => {
    // delete only if server request was success
    dispatcher.dispatch({ type: Constants.Actions.TaskListStore.DELETE, id: id });
  });
}
