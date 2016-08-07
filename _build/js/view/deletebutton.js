if(!React) var React = require("react"); // only require React if need be (server-side rendering)

var endpoints = require('./../model/endpoints');

var DeleteButton = (props) => (
  <div className="task-bar">
    <button type="submit" disabled={props.disabled} formAction={ endpoints.DELETE_TASKS || '/delete/completed/tasks/' } onClick={props.onClick}>{props.text || 'Delete Selected Tasks'}</button>
  </div>
);

module.exports = DeleteButton;
