require('babel-core/register')({
    presets: ['es2015', 'react']
});

var http = require('http'),
fs = require('fs'),
Twig = require("twig"),
express = require('express'),
formidable = require("formidable"),
pg = require('pg').native,
React = require('react'),
createStore = require('redux').createStore,
endpoints = require('./_build/js/model/endpoints'),
reducer = require('./_build/js/model/reducers'),
ReactDOM = require('react-dom/server'),
store = require('./_build/js/model/store'),
actions = require('./_build/js/model/actions'),
ToDoForm = require('./_build/js/view/todoform'),
ArchiveForm = require('./_build/js/view/archiveform'),
app = express();

pg.defaults.ssl = true;

app.get('/', function(req, res){
  getTasks('WHERE archived = 1').then(function(tasks){ // check if there are any archived tasks
    return (tasks)
  }).then(function(archivedTasks){
    store.dispatch(actions.fetchArchiveListSuccess(archivedTasks));
    getTasks().then(function(tasks){
      store.dispatch(actions.fetchToDoSuccess(tasks));
      res.render('index.twig',{
        react: ReactDOM.renderToStaticMarkup(
          React.createElement(ToDoForm,{
            tasks:store.getState().tasks,
            archivedTasks:store.getState().archivedTasks,
            viewProps:store.getState().viewProps,
            showResetSave:true
          })
        ).replace('id="new-item"','autofocus id="new-item"') // #janky https://github.com/facebook/react/issues/3066
      });
    },function(err){});
  })
});

/*
/\ \__
___   _ __    __     __  \ \ ,_\    __
/'___\/\`'__\/'__`\ /'__`\ \ \ \/  /'__`\
/\ \__/\ \ \//\  __//\ \L\.\_\ \ \_/\  __/
\ \____\\ \_\\ \____\ \__/.\_\\ \__\ \____\
\/____/ \/_/ \/____/\/__/\/_/ \/__/\/___*/

app.post('/', function(req, res){
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files){
    var unarchiveSelected = fields.unarchiveselected == '1' ? true : false;
    new Promise(function(resolve, reject){
      if(!fields['new-item']) { // update tasks
        var completed = getCompletedTaskIds(fields);
        if(!unarchiveSelected) {
          updateTaskCompletedStatus(completed,true).then(function(results){
            resolve(results);
          },function(err){});
        } else {
          archiveTasks(completed,false,true).then(function(results){
            resolve(results);
          },function(err){});
        }
      } else { // add task
        addTask(fields['new-item'],false).then(function(results){
          resolve(results);
        },function(err){});
      }
    }).then(function(results){
      return new Promise(function(resolve, reject){
        try {
          getTasks('WHERE archived = 1').then(function(tasks){ // check if there are any archived tasks
            store.dispatch(actions.fetchArchiveListSuccess(tasks));
            resolve({
              results:results,
              archivedTasks:tasks
            })
          })
        } catch(err) {
          resolve({
            results:results,
            archivedTasks:[]
          })
        }
      })
    }).then(function(data){
      getTasks().then(function(tasks){
        store.dispatch(actions.fetchToDoSuccess(tasks));
        res.render('index.twig',{
          tasks:tasks,
          endpoints:endpoints,
          react: ReactDOM.renderToStaticMarkup(
            React.createElement(ToDoForm,{
              tasks:store.getState().tasks,
              archivedTasks:store.getState().archivedTasks,
              viewProps:store.getState().viewProps,
              showResetSave:true
            })
          ).replace('id="new-item"','autofocus id="new-item"') // #janky https://github.com/facebook/react/issues/3066
        });
      },function(err){});
    },function(err){});
  });
});

 /*____  ____    ______
/\  _  \/\  _`\ /\__  _\
\ \ \L\ \ \ \L\ \/_/\ \/
 \ \  __ \ \ ,__/  \ \ \
  \ \ \/\ \ \ \/    \_\ \__
   \ \_\ \_\ \_\    /\_____\
    \/_/\/_/\/_/    \/____*/

app.get(endpoints.API_ARCHIVE, function(req, res){
  getTasks('WHERE archived = 1').then(function(tasks){
    res.json({
      tasks:tasks
    });
  });
});

app.get(endpoints.API_TODOS, function(req, res){
  getTasks().then(function(tasks){
    res.json({
      tasks:tasks
    });
  });
});

app.put(endpoints.API_ADD_TASK, function(req, res){
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {

    addTask(fields['new-item'],false).then(function(tasks){
      res.json({
        success:true,
        task:tasks[0]
      });
    });
  });
});

app.post(endpoints.API_TASKS, function(req, res){
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {

    switch(fields.action) {
      case 'complete':
      updateTaskCompletedStatus(fields.tasks,false,false,fields.completed).then(function(results){
        res.json({
          results:results
        });
      });
      break;

      case 'archive':
      archiveTasks(fields.tasks).then(function(tasks){
        res.json({
          tasks:tasks
        })
      });
      break;

      case 'unarchive':
      archiveTasks(fields.tasks, false, true).then(function(tasks){
        res.json({
          tasks:tasks
        })
      });
      break;
    }
  });
});

  /*          ___           __
 /\ \        /\_ \         /\ \__
 \_\ \     __\//\ \      __\ \ ,_\    __
 /'_` \  /'__`\\ \ \   /'__`\ \ \/  /'__`\
/\ \L\ \/\  __/ \_\ \_/\  __/\ \ \_/\  __/
\ \___,_\ \____\/\____\ \____\\ \__\ \____\
 \/__,_ /\/____/\/____/\/____/ \/__/\/___*/

app.post(endpoints.DELETE_TASKS, function(req, res){
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files){
    var ids = getCompletedTaskIds(fields);
    deleteTasks(ids).then(function(tasks){
      res.render('deletedtasks.twig',{
        tasks:tasks,
        endpoints:endpoints
      });
    },function(err){});
  });
});

app.delete(endpoints.API_DELETE_TASKS, function(req, res){
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files){
    var tasks = fields.tasks;
    deleteTasks(tasks).then(function(tasks){
      res.json({
        tasks:tasks
      });
    },function(err){});
  });
});

                     /*
                    /\ \      __
   __     _ __   ___\ \ \___ /\_\  __  __     __
 /'__`\  /\`'__\/'___\ \  _ `\/\ \/\ \/\ \  /'__`\
/\ \L\.\_\ \ \//\ \__/\ \ \ \ \ \ \ \ \_/ |/\  __/
\ \__/.\_\\ \_\\ \____\\ \_\ \_\ \_\ \___/ \ \____\
 \/__/\/_/ \/_/ \/____/ \/_/\/_/\/_/\/__/   \/___*/

app.post(endpoints.ARCHIVE_COMPLETED_TASKS, function(req, res){
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files){
    var ids = getCompletedTaskIds(fields);
    archiveTasks(ids).then(function(tasks){
      store.dispatch(actions.fetchArchiveListSuccess(tasks));
      res.render('archivedtasks.twig',{
        tasks:tasks,
        endpoints:endpoints,
        viewAllArchivedTasks:true,
        showReset:false,
        react: ReactDOM.renderToStaticMarkup(
          React.createElement(ArchiveForm,{
            tasks:store.getState().archivedTasks,
            viewProps:store.getState().viewProps,
            showResetSave:true
          })
        )
      });
    },function(err){});
  });
});

app.get(endpoints.ARCHIVED_TASKS, function(req, res){
  getTasks('WHERE archived = 1').then(function(tasks){
    store.dispatch(actions.fetchArchiveListSuccess(tasks));
    res.render('archivedtasks.twig',{
      tasks:tasks,
      endpoints:endpoints,
      reset:'Select All',
      react: ReactDOM.renderToStaticMarkup(
        React.createElement(ArchiveForm,{
          tasks:store.getState().archivedTasks,
          viewProps:store.getState().viewProps,
          showResetSave:true
        })
      )
    });
  },function(err){});
});

 /*              ___
/\ \            /\_ \
\ \ \___      __\//\ \    _____      __   _ __   ____
 \ \  _ `\  /'__`\\ \ \  /\ '__`\  /'__`\/\`'__\/',__\
  \ \ \ \ \/\  __/ \_\ \_\ \ \L\ \/\  __/\ \ \//\__, `\
   \ \_\ \_\ \____\/\____\\ \ ,__/\ \____\\ \_\\/\____/
    \/_/\/_/\/____/\/____/ \ \ \/  \/____/ \/_/ \/___/
                            \ \_\
                             \/*/

/**
 * Resolves a promise with all tasks as rows
* @param {string} where - Optional where query such as 'WHERE archived = 0'
*/
function getTasks(where = 'WHERE archived = 0') {
  return new Promise(function(resolve, reject){
    var client = new pg.Client(process.env.DATABASE_URL);

    // connect to our database
    client.connect(function (err) {
      if (err) reject(err);

      // execute a query on our database
      client.query(`SELECT * FROM "tasks" ${where} ORDER BY id;`, function (err, result) {
        if (err) reject(err);

        // disconnect the client
        client.end(function (err) {
          if (err) reject(err);
        });

        resolve(result.rows);
      });
    });

  });
}

/**
 * Adds a task
 * @param {string} title - The title of the task.
 * @param {boolean} completed - Whether or not the task has been completed.
 */
function addTask(title, completed) {
  completed = (completed) ? 1 : 0;
  return new Promise(function(resolve, reject){
    var client = new pg.Client(process.env.DATABASE_URL);

    // connect to our database
    client.connect(function (err) {
      if (err) reject(err);

      var query = `
      WITH "add_task" AS (
      INSERT INTO "tasks" (title,completed)
        VALUES($1,$2)
      RETURNING *
      )
      SELECT * FROM "add_task" ORDER BY id;
      `;

      // execute a query on our database
      client.query(query, [title,completed], function (err, result) {
        if (err) reject(err);

        // disconnect the client
        client.end(function (err) {
          if (err) reject(err);
        });

        resolve(result.rows);
      });
    });
  });
}

/**
 * Update status of multiple tasks
 * @param {Array} ids - ids of tasks to mark as completed.
 * @param {boolean} uncompleteMissing - If true, marks any tasks not present in ids as uncomplete.
 */
function updateTaskCompletedStatus(ids,uncompleteMissing = false,returnAll = true,completed = true) {
  var completed = (ids.length && completed) ? 1 : 0;
  uncompleteMissing = (ids.length) ? uncompleteMissing : false;
  var where = (ids.length) ? ` WHERE id IN (${ids})` : '';
  ids = ids.join(',');
  returnAll = (returnAll) ? 'SELECT * FROM "tasks" ORDER BY id;' : '';

  return new Promise(function(resolve, reject){
    var client = new pg.Client(process.env.DATABASE_URL);

    // connect to our database
    client.connect(function (err) {
      if (err) reject(err);

      var uncomplete = (uncompleteMissing) ? `
      , "uncomplete" as (
        UPDATE "tasks" SET completed = 0 WHERE id NOT IN (${ids})
        RETURNING *
      )
      ` : '';

      var query = `
      WITH "update_task" AS (
        UPDATE "tasks" SET completed = ${completed} ${where}
        RETURNING *
      )${uncomplete}
      SELECT * FROM "update_task";

      ${returnAll}
      `;

      // execute a query on our database
      client.query(query, function (err, result) {
        if (err) reject(err);

        // disconnect the client
        client.end(function (err) {
          if (err) reject(err);
        });

        resolve(result.rows);
      });
    });
  });
}

/**
 * Updates the archived status of several tasks
 * @param {Array} ids - ids of tasks to mark as archived.
 * @param {boolean} uncompleteMissing - If true, marks any tasks not present in ids as not archived.
 * @param {boolean} forceUnarchive - If true, forces selected  tasks to be unarchived
 */
function archiveTasks(ids,unarchiveMissing = false, forceUnarchive = false) {
  var archived = (ids.length && !forceUnarchive) ? 1 : 0;
  unarchiveMissing = (ids.length) ? unarchiveMissing : false;
  var where = (ids.length) ? ` WHERE id IN (${ids})` : '';
  ids = ids.join(',');

  return new Promise(function(resolve, reject){
    var client = new pg.Client(process.env.DATABASE_URL);

    // connect to our database
    client.connect(function (err) {
      if (err) reject(err);

      var unarchive = (unarchiveMissing) ? `
      , "unarchive" as (
        UPDATE "tasks" SET archived = 0 WHERE id NOT IN (${ids})
        RETURNING *
      )
      ` : '';

      var query = `
      WITH "archive_task" AS (
        UPDATE "tasks" SET archived = ${archived}${where}
        RETURNING *
      )${unarchive}
      SELECT * FROM "archive_task";
      `;

      // execute a query on our database
      client.query(query, function (err, result) {
        if (err) reject(err);

        // disconnect the client
        client.end(function (err) {
          if (err) reject(err);
        });

        resolve(result.rows);
      });
    });
  });
}

function deleteTasks(ids) {
  ids = ids.join(',');

  return new Promise(function(resolve, reject){
    var client = new pg.Client(process.env.DATABASE_URL);

    // connect to our database
    client.connect(function (err) {
      if (err) reject(err);

      var query = `
      WITH "delete_tasks" AS (
        DELETE FROM "tasks" WHERE id IN (${ids})
        RETURNING *
      )
      SELECT * FROM "delete_tasks" ORDER BY id;
      `;

      // execute a query on our database
      client.query(query, function (err, result) {
        if (err) reject(err);

        // disconnect the client
        client.end(function (err) {
          if (err) reject(err);
        });

        resolve(result.rows);
      });
    });
  });
}

/**
 * Provided field properties, returns an array of ids of completed tasks
 * @param {Array} fields - Object of field properties containing task items
 * @returns {Array}
*/
function getCompletedTaskIds(fields) {
  var a = [];
  for(var prop in fields) {
    var p = prop.split('_');
    if(p[0] == 'item') a.push(parseInt(p[1]));
  }
  return a;
}

       /*             __
      /\ \__         /\ \__  __
  ____\ \ ,_\    __  \ \ ,_\/\_\    ___         ____     __   _ __   __  __     __   _ __
 /',__\\ \ \/  /'__`\ \ \ \/\/\ \  /'___\      /',__\  /'__`\/\`'__\/\ \/\ \  /'__`\/\`'__\
/\__, `\\ \ \_/\ \L\.\_\ \ \_\ \ \/\ \__/     /\__, `\/\  __/\ \ \/ \ \ \_/ |/\  __/\ \ \/
\/\____/ \ \__\ \__/.\_\\ \__\\ \_\ \____\    \/\____/\ \____\\ \_\  \ \___/ \ \____\\ \_\
 \/___/   \/__/\/__/\/_/ \/__/ \/_/\/____/     \/___/  \/____/ \/_/   \/__/   \/____/ \/*/

app.use(express.static(__dirname));

app.listen(process.env.PORT || 1187);

console.log("server listening on " + (process.env.PORT || 1187));
console.log("Visit http://localhost:" + (process.env.PORT || 1187) + " in your browser");
