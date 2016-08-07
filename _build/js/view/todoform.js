if(!React) var React = require("react"); // only require React if need be (server-side rendering)

import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

var store = require('./../model/store'),
actions = require('./../model/actions'),
endpoints = require('./../model/endpoints'),
TaskListItem = require('./tasklistitem'),
ArchiveButton = require('./archivebutton'),
DeleteButton = require('./deletebutton'),
helpers = require('./../model/helpers');

class ToDoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newTask:'',
      action:actions.ADDTASK
    };
  }
  getInitialProps(){
    return {
      showResetSave:false,
      hideArchived:true
    }
  }

  fetchData(){
    store.dispatch(actions.fetchToDoList())
  }

  componentWillMount(){ // right before the component draws reach out to server to update todo list just incase it changed
    if(helpers.serverSideRendering) return;
    try {
      if(performance.now() > store.getState().viewProps.staleTime) this.fetchData();
    } catch(e) {}
  }

  componentDidMount() {
    try {
      ReactDOM.findDOMNode(this.refs.newItem).focus();
    } catch(e) {}
  }

  getCompletedTasks() {
    return this.props.tasks.filter((task,index) => (
      (task.completed)
    ))
  }

  getUncompletedTasks() {
    return this.props.tasks.filter((task,index) => (
      (!task.completed)
    ))
  }

  getCompletedTaskIds(completedTasks = undefined) {
    return (completedTasks || getUncompletedTasks()).map((task) => (
      task.id
    ))
  }

  getUncompletedTaskIds(uncompletedTasks = undefined) {
    return (uncompletedTasks || getUncompletedTasks()).map((task) => (
      task.id
    ))
  }

  updatePageTitle(uncompletedTasks = undefined) {
    if(helpers.serverSideRendering) return;

    let title = document.querySelector('head title');
    title.innerHTML = title.getAttribute('data-base') + (uncompletedTasks ? `(${ uncompletedTasks.length.toString() })` : '');
  }

  render(){
    var props = this.props,
    tasks = props.tasks,
    state = this.state,
    hideArchived = props.hideArchived;

    if(hideArchived) {
      tasks = tasks.filter((task) => (
        (!task.archived) ? task : undefined
      ));
    }

    var completedTasks = this.getCompletedTasks(),
    uncompletedTasks = this.getUncompletedTasks(),
    completedTaskIds = this.getCompletedTaskIds(completedTasks),
    uncompletedTaskIds = this.getUncompletedTaskIds(uncompletedTasks);

    this.updatePageTitle(uncompletedTasks);

    var tasksExist = tasks.length ? (
      <div>
        <hr />
        <p className="accessibly-hidden">
          You have { uncompletedTasks.length } { `thing${(uncompletedTasks.length > 1 ? 's' : '')}` } to&nbsp;do.
        </p>
        <p className="accessibly-hidden">
          Check tasks below to complete, archive, or delete&nbsp;them.
        </p>
      </div>
    ) : false;

    var resetSave = props.showResetSave ? (
      <div>
        <button type="reset">Reset</button>
        <button type="submit">Save</button>
      </div>
    ) : false;

    var tasksList = tasks.map((task,index) => (
      <TaskListItem task={task} key={task.id} onChange={(event) => {
        store.dispatch(actions.toggleTasksCompletion([task.id], event.target.checked))
      }} />
    ));

    var footer = tasks.length ? (
      <footer>
        {resetSave}
        <ArchiveButton disabled={!helpers.serverSideRendering && !completedTasks.length} text={completedTasks.length > 1 ? "Archive Completed Tasks" : "Archive Completed Task"} onClick={(event) => {
          this.setState({
            action:actions.ARCHIVETASKS
          })
        }} />
      <DeleteButton disabled={!helpers.serverSideRendering && !completedTasks.length} text={completedTasks.length > 1 ? "Delete Completed Tasks" : "Delete Completed Task"} onClick={(event) => {
          this.setState({
            action:actions.DELETETASKS
          })
        }} />
      </footer>
    ) : false;

    var loadArchivedTasksLink = (!helpers.serverSideRendering) ? (<Link to='/archive' className="btn">Load archived&nbsp;tasks</Link>) : (<a href='/archive' className="btn">Load archived&nbsp;tasks</a>),
    loadArchivedTasks = props.archivedTasks.length ? (
      <p className="balanced view-all">
        {loadArchivedTasksLink}.
      </p>
    ) : false;

    return (
      <main id="task-list" className="shell shell-task-list">

        <div className="balanced">
          <form action="/" method="post" id="todo" className="box" onSubmit={(event) => {
            event.preventDefault();

            switch(this.state.action) {
              case actions.DELETETASKS:
              store.dispatch(actions.deleteTasks(completedTaskIds));
              break;

              case actions.ARCHIVETASKS:
              store.dispatch(actions.moveTasksToArchive(completedTasks)); // immediately update model (memory) to keep the UI snappy
              store.dispatch(actions.archiveTasks(completedTaskIds)); // push updates to server
              break;

              case actions.ADDTASK:
              default:
              store.dispatch(actions.addTask({
                title:state.newTask
              }));
              this.setState({
                newTask:''
              });
              break;
            }
          }}>
            <header className="add-item">
              <h1 id="task-list"><a href="/" className="subtle">To&nbsp;Do List</a></h1>
              <label htmlFor="new-item">Add a New Task</label>
              <div className="new-item__bar">
                <input ref="newItem" value={state.newTask} autoFocus autoComplete="off" type="text" id="new-item" name="new-item" placeholder="Something to do…" onChange={(event) => {
                  this.setState({
                    newTask:event.target.value
                  })
                }} />
                <button disabled={!state.newTask.length && !helpers.serverSideRendering} type="submit" formAction={ endpoints.ADD_TASK || "/" } formMethod="post" onClick={(event) => {
                  this.setState({
                    action:endpoints.ADDTASK
                  })
                }}>Add Task</button>
              </div>
            </header>
            {tasksExist}
            <ol className="naked tasks">
              {tasksList}
            </ol>
            {footer}
            {loadArchivedTasks}
          </form>
        </div>
      </main>
    );
  }
}

module.exports = ToDoForm;
