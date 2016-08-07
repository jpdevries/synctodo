var todo = require('./todo');

document.addEventListener('DOMContentLoaded', function() {
    var app = new todo.ToDo();
    document.querySelector('html').classList.add('react');
});
