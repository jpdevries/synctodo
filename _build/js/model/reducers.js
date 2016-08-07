var actions = require('./actions');
var combineReducers = require('redux').combineReducers;
var update = require('react-addons-update');

function getInitialTasks(query = '.tasks > li') {
  var tasks = [];

  // rather than load our app data from a JavaScript object or an XHR request for JSON, we pull it straight out of the initial DOM
  try {
    var taskNodes = document.querySelectorAll(query);
    for(var i = 0; i < taskNodes.length; i++) {
      var taskNode = taskNodes[i],
      title = taskNode.querySelector('.title').innerHTML,
      completed = taskNode.querySelector('input[type="checkbox"]').checked,
      id = parseInt(taskNode.getAttribute('data-id')),
      archived = taskNode.getAttribute('data-archived') == 'true',
      task = {
        id:id,
        key:id,
        title:title,
        completed:completed,
        archived:archived
      };

      tasks.push(task);
    }
  } catch(e) {}

  return tasks;
}

var initialTaskState = getInitialTasks();
var initialArchivedTasks = getInitialTasks('.archived.tasks > li');

var initialViewProps = (function(){
  try {
    return {
      initialView:document.body.getAttribute('init-view') || 'home',
      staleTime:(document.body.getAttribute('stale-time')) ? parseInt(document.body.getAttribute('stale-time')) : 15000
    }
  } catch(e) {
    return {};
  }
})();

var tasksReducer = function(state, action) {
  state = state || initialTaskState;

  switch(action.type) {
    case actions.ADD_TASK_SUCCESS:

    return update(state, {$push:[
      Object.assign({},action.task,{
        key:action.task.id,
        completed:(action.task.completed) ? true : false,
        archived:(action.task.archived) ? true : false
      })
    ]});
    break;

    case actions.TOGGLE_TASKS_COMPLETION_SUCCESS:
    return state.map(function(task,index){
      if(action.tasks.includes(task.id)) {
        return Object.assign({},task,{
          completed:action.completed
        })
      }
      return task;
    })
    break;

    case actions.DELETE_TASKS_SUCCESS:
    return state.filter((task,index) => (
      (!action.tasks.includes(task.id))
    ));
    break;

    case actions.ARCHIVE_TASKS_SUCCESS: // works for both ARCHIVE
    case actions.MOVE_TASKS_TO_ARCHIVE:
    if(action.archive) {
      return state.filter((task,index) => (
        !action.tasks.includes(task.id)
      ));
    } else { // unarchiving
      return update(state, {$push:action.taskData.filter((task) => {
        // make sure we don't have duplicate keys, kinda long winded and not completely necessary but prevents a flattenChildren duplicate key warning
        let keyExists = false,
        l = state.length;
        for(var i = 0; i < l; i++) {
          if(state[i].id == task.id) {
            keyExists = true;
            break;
          }
        }
        return !keyExists;
      }).map((task) => (
        Object.assign({},task,{
          archived:false
        })
      ))})
    }

    break;

    case actions.FETCH_TODOS_SUCCESS:
    return update(state, {$set:action.tasks.map((task) => (
      Object.assign({},{key:task.id},task)
    ))});
    break;

    case actions.MOVE_TASKS_FROM_ARCHIVE:
    var newState = update(state, {$push:action.tasks.map((task) => (
      Object.assign({},task,{
        key:task.id,
        archived:false,
        completed:task.completed ? true : false
      })
    ))});
    return newState;
    break;


  }

  return state;
}

var viewPropsReducer = function(state, action) {
  state = state || initialViewProps;
  return state;
}

var archivedTasksReducer = function(state, action) {
  state = state || initialArchivedTasks;

  switch(action.type) {
    case actions.FETCH_ARCHIVE_LIST_SUCCESS:
    return update(state, {$set:action.tasks.map((task) => (
      Object.assign({},{key:task.id},task)
    ))});
    break;

    case actions.TOGGLE_ARCHIVED_TASKS_SELECTED:
    return state.map((task) => (
      (action.tasks.includes(task.id)) ? Object.assign({},task,{
        completed:action.selected // #janky, archived tasks are just selected on or off, not "completed". archived tasks are inherently complete
      }) : task
    ));
    break;

    case actions.MOVE_TASKS_TO_ARCHIVE:
    return update(state, {$push:action.tasks});
    break;

    case actions.DELETE_TASKS_SUCCESS:
    return state.filter(function(task,index){
      return (!action.tasks.includes(task.id));
    });
    break;

    case actions.MOVE_TASKS_FROM_ARCHIVE:
    return state.filter((task) => (
      (!action.tasks.includes(task))
    ));

  }



  return state;
}

var todoReducer = combineReducers({
  tasks:tasksReducer,
  archivedTasks:archivedTasksReducer,
  viewProps:viewPropsReducer
});

exports.todoReducer = todoReducer;
