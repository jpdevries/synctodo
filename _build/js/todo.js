import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

var actions = require('./model/actions'),
store = require('./model/store'),
ToDoForm = require('./view/todoform'),
ArchiveForm = require('./view/archiveform');

var ToDo = function() {

  switch(store.getState().viewProps.initialView) {
    case 'archive':
    store.dispatch(actions.fetchToDoList()); // if the initial view is the archive page, reach out the the API to prefetch the non-archived tasks
    break;

    case 'home':
    default:
    store.dispatch(actions.fetchArchiveList()); // if the initial view is the homepage, reach out to API to prefetch the archived task
    break;
  }

  var ToDoFormController = connect(function(state, props) { // todo list
    return {
      tasks:state.tasks,
      archivedTasks:state.archivedTasks,
      viewProps:state.viewProps
    }
  })(ToDoForm);

  var ArchiveFormController = connect(function(state, props) { // archived list
    return {
      tasks:state.archivedTasks,
      viewProps:state.viewProps
    }
  })(ArchiveForm);

  class App extends Component {
    render() {
      return (
        <Router history={browserHistory}>
          <Route path='/' component={ToDoFormController} />
          <Route path='/archive' component={ArchiveFormController} />
        </Router>
      )
    }
  }

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('task-list')
  );
};

exports.ToDo = ToDo;
