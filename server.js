require('babel-core/register')({
    presets: ['es2015', 'react']
});

var http = require('http'),
fs = require('fs'),
Twig = require("twig"),
express = require('express'),
formidable = require("formidable"),
pg = require('pg').native,
React = require('React'),
createStore = require('redux').createStore,
endpoints = require('./_build/js/model/endpoints'),
//reducer = require('./_build/js/model/reducers'),
ReactDOM = require('react-dom/server'),
//store = require('./_build/js/model/store'),
//actions = require('./_build/js/model/actions'),
app = express();


                            /*
                           /\ \__
  ___   _ __    __     __  \ \ ,_\    __
 /'___\/\`'__\/'__`\ /'__`\ \ \ \/  /'__`\
/\ \__/\ \ \//\  __//\ \L\.\_\ \ \_/\  __/
\ \____\\ \_\\ \____\ \__/.\_\\ \__\ \____\
 \/____/ \/_/ \/____/\/__/\/_/ \/__/\/___*/

app.get('/', function(req, res){
  getTasks('WHERE archived = 1').then(function(tasks){ // check if there are any archived tasks
    return (tasks)
  }).then(function(archivedTasks){
    getTasks().then(function(tasks){
      res.render('index.twig',{
        tasks:tasks,
        endpoints:endpoints,
        showArchiveLink:archivedTasks.length ? true : false // only show link to archives if there will be stuff to see there
      });
    },function(err){});
  })
});

                   /*            __
                  /\ \          /\ \__
 __  __  _____    \_\ \     __  \ \ ,_\    __
/\ \/\ \/\ '__`\  /'_` \  /'__`\ \ \ \/  /'__`\
\ \ \_\ \ \ \L\ \/\ \L\ \/\ \L\.\_\ \ \_/\  __/
 \ \____/\ \ ,__/\ \___,_\ \__/.\_\\ \__\ \____\
  \/___/  \ \ \/  \/__,_ /\/__/\/_/ \/__/\/____/
           \ \_\
            \/*/

app.post('/', function(req, res){
  console.log('POST');
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files){
    console.log(fields);
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
        getTasks('WHERE archived = 1').then(function(tasks){ // check if there are any archived tasks
          resolve({
            results:results,
            archivedTasks:tasks
          })
        })
      })
    }).then(function(data){
      getTasks().then(function(tasks){
        res.render('index.twig',{
          tasks:tasks,
          endpoints:endpoints,
          showArchiveLink:data.archivedTasks.length ? true : false // only show link to archives if there will be stuff to see there
        });
      },function(err){});
    },function(err){});
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
      res.render('archivedtasks.twig',{
        tasks:tasks,
        endpoints:endpoints,
        viewAllArchivedTasks:true,
        showReset:false
      });
    },function(err){});
  });
});

app.get(endpoints.ARCHIVED_TASKS, function(req, res){
  getTasks('WHERE archived = 1').then(function(tasks){
    res.render('archivedtasks.twig',{
      tasks:tasks,
      endpoints:endpoints,
      reset:'Select All'
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
    var client = new pg.Client();

    // connect to our database
    client.connect(function (err) {
      if (err) reject(err);

      // execute a query on our database
      client.query(`SELECT * FROM "tasks" ${where} ORDER BY id;`, function (err, result) {
        //console.log(result);
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
    var client = new pg.Client();

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
        //console.log(result);
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
function updateTaskCompletedStatus(ids,uncompleteMissing = false) {
  var completed = (ids.length) ? 1 : 0;
  uncompleteMissing = (ids.length) ? uncompleteMissing : false;
  var where = (ids.length) ? ` WHERE id IN (${ids})` : '';
  ids = ids.join(',');

  return new Promise(function(resolve, reject){
    var client = new pg.Client();

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

      SELECT * FROM "tasks" ORDER BY id;
      `;

      // execute a query on our database
      client.query(query, function (err, result) {
        //console.log(result);
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
    var client = new pg.Client();

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
        //console.log(result);
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
    var client = new pg.Client();

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
        //console.log(result);
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
