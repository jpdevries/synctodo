if(!React) var React = require("react"); // only require React if need be (server-side rendering)

import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

var store = require('./../model/store'),
actions = require('./../model/actions'),
endpoints = require('./../model/endpoints'),
TaskListItem = require('./tasklistitem'),
DeleteButton = require('./deletebutton'),
ToDoForm = require('./todoform'),
helpers = require('./../model/helpers');

class ArchiveForm extends ToDoForm {
  constructor(props) {
    super(props);
    this.state = {
      action:actions.UNARCHIVETASKS
    };
  }

  getInitialProps(){
    return {
      showResetSave:false
    }
  }

  fetchData(){
    store.dispatch(actions.fetchArchiveList())
  }

  render(){
    var props = this.props,
    tasks = props.tasks;

    var loadAll = (props.showLoadAllLink) ? (
      <span>
        <br />
        <a href={ endpoints.ARCHIVED_TASKS } className="btn">Load all archived&nbsp;tasks</a>.
      </span>
    ) : false;

    // NOTE: by "completed" we actually mean selected, archived tasks are implicitly complete #janky
    var completedTasks = this.getCompletedTasks(),
    uncompletedTasks = this.getUncompletedTasks(),
    completedTaskIds = this.getCompletedTaskIds(completedTasks),
    uncompletedTaskIds = this.getUncompletedTaskIds(uncompletedTasks);

    this.updatePageTitle(tasks);

    var tasksExist = tasks.length ? (
      <p>
        The following completed { (tasks.length > 1) ? 'tasks have' : 'task has' } been archived.
        {loadAll}
      </p>
    ) : false;

    var tasksList = tasks.map((task,index) => (
      <TaskListItem task={task} key={task.id} onChange={(event) => (
        store.dispatch(actions.toggleArchivedTasksSelected([task.id], event.target.checked))
      )} />
    ));

    var rest = (props.showResetSave) ? (
      <div>
        <button type="reset">Reset</button>
      </div>
    ) : false;
    var footerTasksExist = tasks.length ? (
      <div>
        <div className="task-bar">
          <button disabled={!helpers.serverSideRendering && !completedTasks.length} type="submit" onClick={(event) => {
            this.setState({
              action:actions.UNARCHIVETASKS
            })
          }}>{(completedTasks.length > 1) ? 'Unarchive Selected Tasks' : 'Unarchive Selected Task'}</button>
        </div>
        <DeleteButton text={completedTasks.length > 1 ? "Delete Completed Tasks" : "Delete Completed Task"} disabled={!helpers.serverSideRendering && !completedTasks.length} onClick={(event) => {
          this.setState({
            action:actions.DELETETASKS
          })
        }} />
      </div>
    ) : (
      <p>
        There are no archived tasks.
      </p>
    );

    var footerReturnToLink = (!helpers.serverSideRendering) ? (<Link to='/' className="btn">Return to Task&nbsp;Manager.</Link>) : (<a href='/' className="btn">Return to Task&nbsp;Manager.</a>),
    footer = (
      <footer>
        { footerTasksExist }
        <div className="balanced task-bar">
          {footerReturnToLink}
        </div>
      </footer>
    );

    return (
      <main id="task-list" className="shell shell-task-list">
        <div className="balanced">
          <form action={ endpoints.UPDATE_TASKS } method="post" id="todo" action="#" method="post" className="box" onSubmit={(event) => {
            event.preventDefault();

            switch(this.state.action) {
              case actions.UNARCHIVETASKS:
              store.dispatch(actions.moveTasksFromArchive(completedTasks));
              store.dispatch(actions.archiveTasks(completedTaskIds, false, completedTasks));
              break;

              case actions.DELETETASKS:
              store.dispatch(actions.deleteTasks(completedTaskIds));
              break;
            }
          }}>
            <input type="hidden" name="unarchiveselected" value="1" />
            <div>
              <header>
                <h1 id="task-list"><a href="/" className="subtle">Archived Tasks</a></h1>
              </header>
              <hr />

              {tasksExist}

              <p className="accessibly-hidden">
                Check tasks below to unarchive or delete&nbsp;them.
              </p>

              <ol className="naked archived tasks">
                { tasksList }
              </ol>
              { footer }
            </div>
          </form>
        </div>
      </main>
    );
  }

}

module.exports = ArchiveForm;
