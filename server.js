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


app.post('/', function(req, res){
  console.log('POST');
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files){
    new Promise(function(resolve, reject){
      if(!fields['new-item']) { // update tasks
        var completed = getCompletedTaskIds(fields);
        updateTaskCompletedStatus(completed,true).then(function(results){
          resolve(results);
        },function(err){});
      } else { // add task
        addTask(fields['new-item'],false).then(function(results){
          resolve(results);
        },function(err){});
      }
    }).then(function(results){
      getTasks().then(function(tasks){
        res.render('index.twig',{
          tasks:tasks,
          endpoints:endpoints
        });
      },function(err){

      });
    },function(err){});
  });
});

app.get('/', function(req, res){
  getTasks().then(function(tasks){
    res.render('index.twig',{
      tasks:tasks,
      endpoints:endpoints
    });
  },function(err){

  });
});

app.post(endpoints.DELETE_COMPLETED_TASKS, function(req, res){
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files){
    var ids = getCompletedTaskIds(fields);
    deleteTasks(ids).then(function(tasks){
      res.render('deletedtasks.twig',{
        tasks:tasks,
        endpoints:endpoints
      });
    },function(err){

    });
  });
});

app.post(endpoints.ARCHIVE_COMPLETED_TASKS, function(req, res){
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files){
    var ids = getCompletedTaskIds(fields);
    archiveTasks(ids).then(function(tasks){
      res.render('archivedtasks.twig',{
        tasks:tasks,
        endpoints:endpoints
      });
    },function(err){

    });
  });
});


/**
 * Resolves a promise with all tasks as rows
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
 */
function archiveTasks(ids,unarchiveMissing = false) {
  var completed = (ids.length) ? 1 : 0;
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
        UPDATE "tasks" SET archived = ${completed}${where}
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

app.use(express.static(__dirname));

app.listen(process.env.PORT || 1187);

console.log("server listening on " + (process.env.PORT || 1187));
console.log("Visit http://localhost:" + (process.env.PORT || 1187) + " in your browser");
