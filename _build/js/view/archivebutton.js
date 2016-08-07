if(!React) var React = require("react"); // only require React if need be (server-side rendering)

var endpoints = require('./../model/endpoints');

var ArchiveButton = (props) => (
  <div className="task-bar">
    <button type="submit" disabled={props.disabled} formAction={ endpoints.ARCHIVE_COMPLETED_TASKS || '/archive/completed/tasks/' } onClick={props.onClick}>{props.text || 'Archive Selected Tasks'}</button>
  </div>
);

module.exports = ArchiveButton;
