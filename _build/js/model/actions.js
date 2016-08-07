require('isomorphic-fetch');

var endpoints = require('./endpoints');

var ADD_TASK_SUCCESS = 'add_task_success';
var ADD_TASK_ERROR = 'add_task_error';
var addTaskSuccess = function(task) {
  return {
    type:ADD_TASK_SUCCESS,
    task:task,
  }
}

var addTaskError = function(task) {
  return {
    type:ADD_TASK_ERROR,
    task:task,
  }
}

var addTask = (task) => (
  (dispatch) => (
    fetch(endpoints.API_ADD_TASK, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.assign({},task,{
        'new-item':task.title
      }))
    }).then(function(response){
      if(response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText)
        error.response = response
        throw error;
      }
      return response;
    }).then((response) => (
      response.json()
    )).then((data) => (
      dispatch(
        addTaskSuccess(data.task)
      )
    )).catch((error) => (
      dispatch(
        addTaskError(task)
      )
    ))
  )
);

exports.ADD_TASK_SUCCESS = ADD_TASK_SUCCESS;
exports.addTaskSuccess = addTaskSuccess;

exports.ADD_TASK_ERROR = ADD_TASK_ERROR;
exports.addTaskError = addTaskError;
exports.addTask = addTask;



var TOGGLE_TASKS_COMPLETION_SUCCESS = 'toggle_tasks_completion_success';
var TOGGLE_TASKS_COMPLETION_ERROR = 'toggle_tasks_completion_error';
var toggleTasksCompletionSuccess = function(tasks,completed) {
  return {
    type:TOGGLE_TASKS_COMPLETION_SUCCESS,
    tasks:tasks,
    completed:completed
  }
}

var toggleTasksCompletionError = function(tasks,completed) {
  return {
    type:TOGGLE_TASKS_COMPLETION_ERROR,
    tasks:tasks,
    completed:completed
  }
}

var toggleTasksCompletion = (ids,completed) => (
  (dispatch) => (
    fetch(endpoints.API_TASKS, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action:'complete',
        completed:completed,
        tasks:ids
      })
    }).then(function(response){
      if(response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText)
        error.response = response
        throw error;
      }
      return response;
    }).then((response) => (
      response.json()
    )).then((data) => (
      dispatch(
        toggleTasksCompletionSuccess(ids, completed)
      )
    )).catch((error) => (
      dispatch(
        toggleTasksCompletionError(ids, completed)
      )
    ))
  )
);

exports.TOGGLE_TASKS_COMPLETION_SUCCESS = TOGGLE_TASKS_COMPLETION_SUCCESS;
exports.toggleTasksCompletionSuccess = toggleTasksCompletionSuccess;

exports.TOGGLE_TASKS_COMPLETION_ERROR = TOGGLE_TASKS_COMPLETION_ERROR;
exports.toggleTasksCompletionError = toggleTasksCompletionError;

exports.toggleTasksCompletion = toggleTasksCompletion;





var DELETE_TASKS_SUCCESS = 'delete_tasks_success';
var DELETE_TASKS_ERROR = 'delete_tasks_error';
var deleteTasksSuccess = function(tasks) {
  return {
    type:DELETE_TASKS_SUCCESS,
    tasks:tasks,
  }
}

var deleteTasksError = function(tasks) {
  return {
    type:DELETE_TASKS_ERROR,
    tasks:tasks,
  }
}

var deleteTasks = (tasks) => (
  (dispatch) => (
    fetch(endpoints.API_DELETE_TASKS, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tasks:tasks
      })
    }).then(function(response){
      if(response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText)
        error.response = response
        throw error;
      }
      return response;
    }).then((response) => (
      response.json()
    )).then((data) => (
      dispatch(
        deleteTasksSuccess(tasks)
      )
    )).catch((error) => (
      dispatch(
        deleteTasksError(tasks)
      )
    ))
  )
);

exports.DELETE_TASKS_SUCCESS = DELETE_TASKS_SUCCESS;
exports.deleteTasksSuccess = deleteTasksSuccess;

exports.DELETE_TASKS_ERROR = DELETE_TASKS_ERROR;
exports.deleteTasksError = deleteTasksError;
exports.deleteTasks = deleteTasks;







var ARCHIVE_TASKS_SUCCESS = 'archive_tasks_success';
var ARCHIVE_TASKS_ERROR = 'archive_tasks_error';
var archiveTasksSuccess = function(tasks,archive,taskData) {
  return {
    type:ARCHIVE_TASKS_SUCCESS,
    tasks:tasks,
    archive:archive,
    taskData:taskData
  }
}

var archiveTasksError = function(tasks,archive,taskData) {
  return {
    type:ARCHIVE_TASKS_ERROR,
    tasks:tasks,
    archive:archive,
    taskData:taskData
  }
}

var archiveTasks = (tasks, archive = true, taskData = []) => (
  (dispatch) => (
    fetch(endpoints.API_ARCHIVE_TASKS, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action:(archive) ? 'archive' : 'unarchive',
        tasks:tasks
      })
    }).then(function(response){
      if(response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText)
        error.response = response
        throw error;
      }
      return response;
    }).then((response) => (
      response.json()
    )).then((data) => (
      dispatch(
        archiveTasksSuccess(tasks,archive,taskData)
      )
    )).catch((error) => (
      dispatch(
        archiveTasksError(tasks,archive,taskData)
      )
    ))
  )
);

exports.ARCHIVE_TASKS_SUCCESS = ARCHIVE_TASKS_SUCCESS;
exports.archiveTasksSuccess = archiveTasksSuccess;

exports.ARCHIVE_TASKS_ERROR = ARCHIVE_TASKS_ERROR;
exports.archiveTasksError = archiveTasksError;
exports.archiveTasks = archiveTasks;








var FETCH_ARCHIVE_LIST_SUCCESS = 'fetch_archive_list_success';
var FETCH_ARCHIVE_LIST_ERROR = 'fetch_archive_list_error';
var fetchArchiveListSuccess = function(tasks) {
  return {
    type:FETCH_ARCHIVE_LIST_SUCCESS,
    tasks:tasks,
  }
}

var fetchArchiveListError = function() {
  return {
    type:FETCH_ARCHIVE_LIST_ERROR
  }
}

var fetchArchiveList = () => (
  (dispatch) => (
    fetch(endpoints.API_ARCHIVE, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(function(response){
      if(response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText)
        error.response = response
        throw error;
      }
      return response;
    }).then((response) => (
      response.json()
    )).then((data) => (
      dispatch(
        fetchArchiveListSuccess(data.tasks)
      )
    )).catch((error) => (
      dispatch(
        fetchArchiveListError()
      )
    ))
  )
);

exports.FETCH_ARCHIVE_LIST_SUCCESS = FETCH_ARCHIVE_LIST_SUCCESS;
exports.fetchArchiveListSuccess = fetchArchiveListSuccess;

exports.FETCH_ARCHIVE_LIST_ERROR = FETCH_ARCHIVE_LIST_ERROR;
exports.fetchArchiveListError = fetchArchiveListError;
exports.fetchArchiveList = fetchArchiveList;









var FETCH_TODOS_SUCCESS = 'fetch_todos_success';
var FETCH_TODOS_ERROR = 'fetch_todos_error';
var fetchToDoSuccess = function(tasks) {
  return {
    type:FETCH_TODOS_SUCCESS,
    tasks:tasks,
  }
}

var fetchToDoError = function() {
  return {
    type:FETCH_TODOS_ERROR
  }
}

var fetchToDoList = () => (
  (dispatch) => (
    fetch(endpoints.API_TODOS, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(function(response){
      if(response.state < 200 || response.state >= 300) {
        var error = new Error(response.statusText)
        error.response = response
        throw error;
      }
      return response;
    }).then((response) => (
      response.json()
    )).then((data) => (
      dispatch(
        fetchToDoSuccess(data.tasks)
      )
    )).catch((error) => (
      dispatch(
        fetchToDoError()
      )
    ))
  )
);

exports.FETCH_TODOS_SUCCESS = FETCH_TODOS_SUCCESS;
exports.fetchToDoSuccess = fetchToDoSuccess;

exports.FETCH_TODOS_ERROR = FETCH_TODOS_ERROR;
exports.fetchToDoError = fetchToDoError;
exports.fetchToDoList = fetchToDoList;

var TOGGLE_ARCHIVED_TASKS_SELECTED = 'toggle_archived_tasks_selected';
var toggleArchivedTasksSelected = function(tasks, selected) {
  return {
    type:TOGGLE_ARCHIVED_TASKS_SELECTED,
    tasks:tasks,
    selected:selected
  }
}

exports.TOGGLE_ARCHIVED_TASKS_SELECTED = TOGGLE_ARCHIVED_TASKS_SELECTED;
exports.toggleArchivedTasksSelected = toggleArchivedTasksSelected;





var MOVE_TASKS_TO_ARCHIVE = 'move_tasks_to_archive';
var moveTasksToArchive = function(tasks) {
  return {
    type:MOVE_TASKS_TO_ARCHIVE,
    tasks:tasks,
    archive:true
  }
}

exports.MOVE_TASKS_TO_ARCHIVE = MOVE_TASKS_TO_ARCHIVE;
exports.moveTasksToArchive = moveTasksToArchive;




var MOVE_TASKS_FROM_ARCHIVE = 'move_tasks_from_archive';
var moveTasksFromArchive = function(tasks) {
  return {
    type:MOVE_TASKS_FROM_ARCHIVE,
    tasks:tasks,
    archive:false
  }
}

exports.MOVE_TASKS_FROM_ARCHIVE = MOVE_TASKS_FROM_ARCHIVE;
exports.moveTasksFromArchive = moveTasksFromArchive;




exports.ADDTASK = 'add-task';
exports.DELETETASKS = 'delete-tasks';
exports.ARCHIVETASKS = 'archive-tasks';
exports.UNARCHIVETASKS = 'unarchive-tasks';
