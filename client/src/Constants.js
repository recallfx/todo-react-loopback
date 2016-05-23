const Constants = {
  Actions: {
    TaskListStore: {
      FETCH: 'ACTION_TASK_LIST_STORE_FETCH',
      CREATE: 'ACTION_TASK_LIST_STORE_CREATE',
      UPDATE: 'ACTION_TASK_LIST_STORE_UPDATE',
      DELETE: 'ACTION_TASK_LIST_STORE_DELETE'
    },

    Ajax: {
      FETCH_START: 'ACTION_AJAX_FETCH_START',
      FETCH_END: 'ACTION_AJAX_FETCH_END',
      FETCH_ERROR: 'ACTION_AJAX_FETCH_ERROR',

      PERSIST_START: 'ACTION_AJAX_PERSIST_START',
      PERSIST_END: 'ACTION_AJAX_PERSIST_END',
      PERSIST_ERROR: 'ACTION_AJAX_PERSIST_ERROR'
    }
  },
  Defaults: {
    TASK_LIST_KEY: 'TASK_LIST'
  }
};

Object.freeze(Constants);
export default Constants;
