if(!React) var React = require("react"); // only require React if need be (server-side rendering)

var store = require('./../model/store'),
actions = require('./../model/actions'),
endpoints = require('./../model/endpoints'),
helpers = require('./../model/helpers');


var TaskListItem = function(props) {
  var task = props.task;
  return (
    <li data-id={ helpers.serverSideRendering ? task.id : undefined }>
      <label htmlFor={ `item_${ task.id }` }>
        <input id={ `item_${ task.id }` } name={ `item_${ task.id }` } type="checkbox" checked={ task.completed } onChange={props.onChange} />&nbsp;<span className="title">{ task.title }</span>
      </label>
    </li>
  )
};

module.exports = TaskListItem;
