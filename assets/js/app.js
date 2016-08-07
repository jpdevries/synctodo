/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var todo = __webpack_require__(1);

	document.addEventListener('DOMContentLoaded', function () {
	    var app = new todo.ToDo();
	    document.querySelector('html').classList.add('react');
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _redux = __webpack_require__(2);

	var _reactRedux = __webpack_require__(3);

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var actions = __webpack_require__(6),
	    store = __webpack_require__(10),
	    ToDoForm = __webpack_require__(20),
	    ArchiveForm = __webpack_require__(25);

	var ToDo = function ToDo() {

	  switch (store.getState().viewProps.initialView) {
	    case 'archive':
	      store.dispatch(actions.fetchToDoList()); // if the initial view is the archive page, reach out the the API to prefetch the non-archived tasks
	      break;

	    case 'home':
	    default:
	      store.dispatch(actions.fetchArchiveList()); // if the initial view is the homepage, reach out to API to prefetch the archived task
	      break;
	  }

	  var ToDoFormController = (0, _reactRedux.connect)(function (state, props) {
	    // todo list
	    return {
	      tasks: state.tasks,
	      archivedTasks: state.archivedTasks,
	      viewProps: state.viewProps
	    };
	  })(ToDoForm);

	  var ArchiveFormController = (0, _reactRedux.connect)(function (state, props) {
	    // archived list
	    return {
	      tasks: state.archivedTasks,
	      viewProps: state.viewProps
	    };
	  })(ArchiveForm);

	  var App = function (_Component) {
	    _inherits(App, _Component);

	    function App() {
	      _classCallCheck(this, App);

	      return _possibleConstructorReturn(this, Object.getPrototypeOf(App).apply(this, arguments));
	    }

	    _createClass(App, [{
	      key: 'render',
	      value: function render() {
	        return _react2.default.createElement(
	          _reactRouter.Router,
	          { history: _reactRouter.browserHistory },
	          _react2.default.createElement(_reactRouter.Route, { path: '/', component: ToDoFormController }),
	          _react2.default.createElement(_reactRouter.Route, { path: '/archive', component: ArchiveFormController })
	        );
	      }
	    }]);

	    return App;
	  }(_react.Component);

	  ReactDOM.render(_react2.default.createElement(
	    _reactRedux.Provider,
	    { store: store },
	    _react2.default.createElement(App, null)
	  ), document.getElementById('task-list'));
	};

	exports.ToDo = ToDo;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = Redux;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = ReactRedux;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = ReactRouter;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(7);

	var endpoints = __webpack_require__(9);

	var ADD_TASK_SUCCESS = 'add_task_success';
	var ADD_TASK_ERROR = 'add_task_error';
	var addTaskSuccess = function addTaskSuccess(task) {
	  return {
	    type: ADD_TASK_SUCCESS,
	    task: task
	  };
	};

	var addTaskError = function addTaskError(task) {
	  return {
	    type: ADD_TASK_ERROR,
	    task: task
	  };
	};

	var addTask = function addTask(task) {
	  return function (dispatch) {
	    return fetch(endpoints.API_ADD_TASK, {
	      method: 'PUT',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify(Object.assign({}, task, {
	        'new-item': task.title
	      }))
	    }).then(function (response) {
	      if (response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText);
	        error.response = response;
	        throw error;
	      }
	      return response;
	    }).then(function (response) {
	      return response.json();
	    }).then(function (data) {
	      return dispatch(addTaskSuccess(data.task));
	    }).catch(function (error) {
	      return dispatch(addTaskError(task));
	    });
	  };
	};

	exports.ADD_TASK_SUCCESS = ADD_TASK_SUCCESS;
	exports.addTaskSuccess = addTaskSuccess;

	exports.ADD_TASK_ERROR = ADD_TASK_ERROR;
	exports.addTaskError = addTaskError;
	exports.addTask = addTask;

	var TOGGLE_TASKS_COMPLETION_SUCCESS = 'toggle_tasks_completion_success';
	var TOGGLE_TASKS_COMPLETION_ERROR = 'toggle_tasks_completion_error';
	var toggleTasksCompletionSuccess = function toggleTasksCompletionSuccess(tasks, completed) {
	  return {
	    type: TOGGLE_TASKS_COMPLETION_SUCCESS,
	    tasks: tasks,
	    completed: completed
	  };
	};

	var toggleTasksCompletionError = function toggleTasksCompletionError(tasks, completed) {
	  return {
	    type: TOGGLE_TASKS_COMPLETION_ERROR,
	    tasks: tasks,
	    completed: completed
	  };
	};

	var toggleTasksCompletion = function toggleTasksCompletion(ids, completed) {
	  return function (dispatch) {
	    return fetch(endpoints.API_TASKS, {
	      method: 'POST',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify({
	        action: 'complete',
	        completed: completed,
	        tasks: ids
	      })
	    }).then(function (response) {
	      if (response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText);
	        error.response = response;
	        throw error;
	      }
	      return response;
	    }).then(function (response) {
	      return response.json();
	    }).then(function (data) {
	      return dispatch(toggleTasksCompletionSuccess(ids, completed));
	    }).catch(function (error) {
	      return dispatch(toggleTasksCompletionError(ids, completed));
	    });
	  };
	};

	exports.TOGGLE_TASKS_COMPLETION_SUCCESS = TOGGLE_TASKS_COMPLETION_SUCCESS;
	exports.toggleTasksCompletionSuccess = toggleTasksCompletionSuccess;

	exports.TOGGLE_TASKS_COMPLETION_ERROR = TOGGLE_TASKS_COMPLETION_ERROR;
	exports.toggleTasksCompletionError = toggleTasksCompletionError;

	exports.toggleTasksCompletion = toggleTasksCompletion;

	var DELETE_TASKS_SUCCESS = 'delete_tasks_success';
	var DELETE_TASKS_ERROR = 'delete_tasks_error';
	var deleteTasksSuccess = function deleteTasksSuccess(tasks) {
	  return {
	    type: DELETE_TASKS_SUCCESS,
	    tasks: tasks
	  };
	};

	var deleteTasksError = function deleteTasksError(tasks) {
	  return {
	    type: DELETE_TASKS_ERROR,
	    tasks: tasks
	  };
	};

	var deleteTasks = function deleteTasks(tasks) {
	  return function (dispatch) {
	    return fetch(endpoints.API_DELETE_TASKS, {
	      method: 'DELETE',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify({
	        tasks: tasks
	      })
	    }).then(function (response) {
	      if (response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText);
	        error.response = response;
	        throw error;
	      }
	      return response;
	    }).then(function (response) {
	      return response.json();
	    }).then(function (data) {
	      return dispatch(deleteTasksSuccess(tasks));
	    }).catch(function (error) {
	      return dispatch(deleteTasksError(tasks));
	    });
	  };
	};

	exports.DELETE_TASKS_SUCCESS = DELETE_TASKS_SUCCESS;
	exports.deleteTasksSuccess = deleteTasksSuccess;

	exports.DELETE_TASKS_ERROR = DELETE_TASKS_ERROR;
	exports.deleteTasksError = deleteTasksError;
	exports.deleteTasks = deleteTasks;

	var ARCHIVE_TASKS_SUCCESS = 'archive_tasks_success';
	var ARCHIVE_TASKS_ERROR = 'archive_tasks_error';
	var archiveTasksSuccess = function archiveTasksSuccess(tasks, archive, taskData) {
	  return {
	    type: ARCHIVE_TASKS_SUCCESS,
	    tasks: tasks,
	    archive: archive,
	    taskData: taskData
	  };
	};

	var archiveTasksError = function archiveTasksError(tasks, archive, taskData) {
	  return {
	    type: ARCHIVE_TASKS_ERROR,
	    tasks: tasks,
	    archive: archive,
	    taskData: taskData
	  };
	};

	var archiveTasks = function archiveTasks(tasks) {
	  var archive = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
	  var taskData = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	  return function (dispatch) {
	    return fetch(endpoints.API_ARCHIVE_TASKS, {
	      method: 'POST',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify({
	        action: archive ? 'archive' : 'unarchive',
	        tasks: tasks
	      })
	    }).then(function (response) {
	      if (response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText);
	        error.response = response;
	        throw error;
	      }
	      return response;
	    }).then(function (response) {
	      return response.json();
	    }).then(function (data) {
	      return dispatch(archiveTasksSuccess(tasks, archive, taskData));
	    }).catch(function (error) {
	      return dispatch(archiveTasksError(tasks, archive, taskData));
	    });
	  };
	};

	exports.ARCHIVE_TASKS_SUCCESS = ARCHIVE_TASKS_SUCCESS;
	exports.archiveTasksSuccess = archiveTasksSuccess;

	exports.ARCHIVE_TASKS_ERROR = ARCHIVE_TASKS_ERROR;
	exports.archiveTasksError = archiveTasksError;
	exports.archiveTasks = archiveTasks;

	var FETCH_ARCHIVE_LIST_SUCCESS = 'fetch_archive_list_success';
	var FETCH_ARCHIVE_LIST_ERROR = 'fetch_archive_list_error';
	var fetchArchiveListSuccess = function fetchArchiveListSuccess(tasks) {
	  return {
	    type: FETCH_ARCHIVE_LIST_SUCCESS,
	    tasks: tasks
	  };
	};

	var fetchArchiveListError = function fetchArchiveListError() {
	  return {
	    type: FETCH_ARCHIVE_LIST_ERROR
	  };
	};

	var fetchArchiveList = function fetchArchiveList() {
	  return function (dispatch) {
	    return fetch(endpoints.API_ARCHIVE, {
	      method: 'GET',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      }
	    }).then(function (response) {
	      if (response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText);
	        error.response = response;
	        throw error;
	      }
	      return response;
	    }).then(function (response) {
	      return response.json();
	    }).then(function (data) {
	      return dispatch(fetchArchiveListSuccess(data.tasks));
	    }).catch(function (error) {
	      return dispatch(fetchArchiveListError());
	    });
	  };
	};

	exports.FETCH_ARCHIVE_LIST_SUCCESS = FETCH_ARCHIVE_LIST_SUCCESS;
	exports.fetchArchiveListSuccess = fetchArchiveListSuccess;

	exports.FETCH_ARCHIVE_LIST_ERROR = FETCH_ARCHIVE_LIST_ERROR;
	exports.fetchArchiveListError = fetchArchiveListError;
	exports.fetchArchiveList = fetchArchiveList;

	var FETCH_TODOS_SUCCESS = 'fetch_todos_success';
	var FETCH_TODOS_ERROR = 'fetch_todos_error';
	var fetchToDoSuccess = function fetchToDoSuccess(tasks) {
	  return {
	    type: FETCH_TODOS_SUCCESS,
	    tasks: tasks
	  };
	};

	var fetchToDoError = function fetchToDoError() {
	  return {
	    type: FETCH_TODOS_ERROR
	  };
	};

	var fetchToDoList = function fetchToDoList() {
	  return function (dispatch) {
	    return fetch(endpoints.API_TODOS, {
	      method: 'GET',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      }
	    }).then(function (response) {
	      if (response.state < 200 || response.state >= 300) {
	        var error = new Error(response.statusText);
	        error.response = response;
	        throw error;
	      }
	      return response;
	    }).then(function (response) {
	      return response.json();
	    }).then(function (data) {
	      return dispatch(fetchToDoSuccess(data.tasks));
	    }).catch(function (error) {
	      return dispatch(fetchToDoError());
	    });
	  };
	};

	exports.FETCH_TODOS_SUCCESS = FETCH_TODOS_SUCCESS;
	exports.fetchToDoSuccess = fetchToDoSuccess;

	exports.FETCH_TODOS_ERROR = FETCH_TODOS_ERROR;
	exports.fetchToDoError = fetchToDoError;
	exports.fetchToDoList = fetchToDoList;

	var TOGGLE_ARCHIVED_TASKS_SELECTED = 'toggle_archived_tasks_selected';
	var toggleArchivedTasksSelected = function toggleArchivedTasksSelected(tasks, selected) {
	  return {
	    type: TOGGLE_ARCHIVED_TASKS_SELECTED,
	    tasks: tasks,
	    selected: selected
	  };
	};

	exports.TOGGLE_ARCHIVED_TASKS_SELECTED = TOGGLE_ARCHIVED_TASKS_SELECTED;
	exports.toggleArchivedTasksSelected = toggleArchivedTasksSelected;

	var MOVE_TASKS_TO_ARCHIVE = 'move_tasks_to_archive';
	var moveTasksToArchive = function moveTasksToArchive(tasks) {
	  return {
	    type: MOVE_TASKS_TO_ARCHIVE,
	    tasks: tasks,
	    archive: true
	  };
	};

	exports.MOVE_TASKS_TO_ARCHIVE = MOVE_TASKS_TO_ARCHIVE;
	exports.moveTasksToArchive = moveTasksToArchive;

	var MOVE_TASKS_FROM_ARCHIVE = 'move_tasks_from_archive';
	var moveTasksFromArchive = function moveTasksFromArchive(tasks) {
	  return {
	    type: MOVE_TASKS_FROM_ARCHIVE,
	    tasks: tasks,
	    archive: false
	  };
	};

	exports.MOVE_TASKS_FROM_ARCHIVE = MOVE_TASKS_FROM_ARCHIVE;
	exports.moveTasksFromArchive = moveTasksFromArchive;

	exports.ADDTASK = 'add-task';
	exports.DELETETASKS = 'delete-tasks';
	exports.ARCHIVETASKS = 'archive-tasks';
	exports.UNARCHIVETASKS = 'unarchive-tasks';

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// the whatwg-fetch polyfill installs the fetch() function
	// on the global object (window or self)
	//
	// Return that as the export for use in Webpack, Browserify etc.
	__webpack_require__(8);
	module.exports = self.fetch.bind(self);


/***/ },
/* 8 */
/***/ function(module, exports) {

	(function(self) {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }

	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }

	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }

	    return iterator
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)

	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }

	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }

	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }

	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }

	  function Body() {
	    this.bodyUsed = false

	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (!body) {
	        this._bodyText = ''
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }

	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }

	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }

	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }

	  Request.prototype.clone = function() {
	    return new Request(this)
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }

	  Body.call(Response.prototype)

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }

	  var redirectStatuses = [301, 302, 303, 307, 308]

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  }

	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response

	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }

	      var xhr = new XMLHttpRequest()

	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }

	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }

	        return
	      }

	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	var ADD_TASK = '/',
	    UPDATE_TASKS = '/',
	    DELETE_TASKS = '/delete/tasks/',
	    ARCHIVED_TASKS = '/archive/',
	    ARCHIVE_COMPLETED_TASKS = ARCHIVED_TASKS,
	    API_TASKS = '/api/tasks/',
	    API_ADD_TASK = API_TASKS,
	    API_DELETE_TASKS = API_TASKS,
	    API_ARCHIVE_TASKS = API_TASKS,
	    API_ARCHIVE = '/api/archive/',
	    API_TODOS = '/api/todos/';

	module.exports = {
	  ADD_TASK: ADD_TASK,
	  UPDATE_TASKS: UPDATE_TASKS,
	  DELETE_TASKS: DELETE_TASKS,
	  ARCHIVE_COMPLETED_TASKS: ARCHIVE_COMPLETED_TASKS,
	  ARCHIVED_TASKS: ARCHIVED_TASKS,
	  API_TASKS: API_TASKS,
	  API_ADD_TASK: API_ADD_TASK,
	  API_DELETE_TASKS: API_DELETE_TASKS,
	  API_ARCHIVE_TASKS: API_ARCHIVE_TASKS,
	  API_ARCHIVE: API_ARCHIVE,
	  API_TODOS: API_TODOS
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var redux = __webpack_require__(2);
	var createStore = redux.createStore;
	var applyMiddleware = redux.applyMiddleware;
	var thunk = __webpack_require__(11).default;

	var reducers = __webpack_require__(12);

	var store = createStore(reducers.todoReducer, applyMiddleware(thunk));

	module.exports = store;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	function createThunkMiddleware(extraArgument) {
	  return function (_ref) {
	    var dispatch = _ref.dispatch;
	    var getState = _ref.getState;
	    return function (next) {
	      return function (action) {
	        if (typeof action === 'function') {
	          return action(dispatch, getState, extraArgument);
	        }

	        return next(action);
	      };
	    };
	  };
	}

	var thunk = createThunkMiddleware();
	thunk.withExtraArgument = createThunkMiddleware;

	exports['default'] = thunk;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var actions = __webpack_require__(6);
	var combineReducers = __webpack_require__(2).combineReducers;
	var update = __webpack_require__(13);

	function getInitialTasks() {
	  var query = arguments.length <= 0 || arguments[0] === undefined ? '.tasks > li' : arguments[0];

	  var tasks = [];

	  // rather than load our app data from a JavaScript object or an XHR request for JSON, we pull it straight out of the initial DOM
	  try {
	    var taskNodes = document.querySelectorAll(query);
	    for (var i = 0; i < taskNodes.length; i++) {
	      var taskNode = taskNodes[i],
	          title = taskNode.querySelector('.title').innerHTML,
	          completed = taskNode.querySelector('input[type="checkbox"]').checked,
	          id = parseInt(taskNode.getAttribute('data-id')),
	          archived = taskNode.getAttribute('data-archived') == 'true',
	          task = {
	        id: id,
	        key: id,
	        title: title,
	        completed: completed,
	        archived: archived
	      };

	      tasks.push(task);
	    }
	  } catch (e) {}

	  return tasks;
	}

	var initialTaskState = getInitialTasks();
	var initialArchivedTasks = getInitialTasks('.archived.tasks > li');

	var initialViewProps = function () {
	  try {
	    return {
	      initialView: document.body.getAttribute('init-view') || 'home',
	      staleTime: document.body.getAttribute('stale-time') ? parseInt(document.body.getAttribute('stale-time')) : 15000
	    };
	  } catch (e) {
	    return {};
	  }
	}();

	var tasksReducer = function tasksReducer(state, action) {
	  state = state || initialTaskState;

	  switch (action.type) {
	    case actions.ADD_TASK_SUCCESS:

	      return update(state, { $push: [Object.assign({}, action.task, {
	          key: action.task.id,
	          completed: action.task.completed ? true : false,
	          archived: action.task.archived ? true : false
	        })] });
	      break;

	    case actions.TOGGLE_TASKS_COMPLETION_SUCCESS:
	      return state.map(function (task, index) {
	        if (action.tasks.includes(task.id)) {
	          return Object.assign({}, task, {
	            completed: action.completed
	          });
	        }
	        return task;
	      });
	      break;

	    case actions.DELETE_TASKS_SUCCESS:
	      return state.filter(function (task, index) {
	        return !action.tasks.includes(task.id);
	      });
	      break;

	    case actions.ARCHIVE_TASKS_SUCCESS: // works for both ARCHIVE
	    case actions.MOVE_TASKS_TO_ARCHIVE:
	      if (action.archive) {
	        return state.filter(function (task, index) {
	          return !action.tasks.includes(task.id);
	        });
	      } else {
	        // unarchiving
	        return update(state, { $push: action.taskData.filter(function (task) {
	            // make sure we don't have duplicate keys, kinda long winded and not completely necessary but prevents a flattenChildren duplicate key warning
	            var keyExists = false,
	                l = state.length;
	            for (var i = 0; i < l; i++) {
	              if (state[i].id == task.id) {
	                keyExists = true;
	                break;
	              }
	            }
	            return !keyExists;
	          }).map(function (task) {
	            return Object.assign({}, task, {
	              archived: false
	            });
	          }) });
	      }

	      break;

	    case actions.FETCH_TODOS_SUCCESS:
	      return update(state, { $set: action.tasks.map(function (task) {
	          return Object.assign({}, { key: task.id }, task);
	        }) });
	      break;

	    case actions.MOVE_TASKS_FROM_ARCHIVE:
	      var newState = update(state, { $push: action.tasks.map(function (task) {
	          return Object.assign({}, task, {
	            key: task.id,
	            archived: false,
	            completed: task.completed ? true : false
	          });
	        }) });
	      return newState;
	      break;

	  }

	  return state;
	};

	var viewPropsReducer = function viewPropsReducer(state, action) {
	  state = state || initialViewProps;
	  return state;
	};

	var archivedTasksReducer = function archivedTasksReducer(state, action) {
	  state = state || initialArchivedTasks;

	  switch (action.type) {
	    case actions.FETCH_ARCHIVE_LIST_SUCCESS:
	      return update(state, { $set: action.tasks.map(function (task) {
	          return Object.assign({}, { key: task.id }, task);
	        }) });
	      break;

	    case actions.TOGGLE_ARCHIVED_TASKS_SELECTED:
	      return state.map(function (task) {
	        return action.tasks.includes(task.id) ? Object.assign({}, task, {
	          completed: action.selected // #janky, archived tasks are just selected on or off, not "completed". archived tasks are inherently complete
	        }) : task;
	      });
	      break;

	    case actions.MOVE_TASKS_TO_ARCHIVE:
	      return update(state, { $push: action.tasks });
	      break;

	    case actions.DELETE_TASKS_SUCCESS:
	      return state.filter(function (task, index) {
	        return !action.tasks.includes(task.id);
	      });
	      break;

	    case actions.MOVE_TASKS_FROM_ARCHIVE:
	      return state.filter(function (task) {
	        return !action.tasks.includes(task);
	      });

	  }

	  return state;
	};

	var todoReducer = combineReducers({
	  tasks: tasksReducer,
	  archivedTasks: archivedTasksReducer,
	  viewProps: viewPropsReducer
	});

	exports.todoReducer = todoReducer;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(14);

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule update
	 */

	/* global hasOwnProperty:true */

	'use strict';

	var _prodInvariant = __webpack_require__(16),
	    _assign = __webpack_require__(17);

	var keyOf = __webpack_require__(18);
	var invariant = __webpack_require__(19);
	var hasOwnProperty = {}.hasOwnProperty;

	function shallowCopy(x) {
	  if (Array.isArray(x)) {
	    return x.concat();
	  } else if (x && typeof x === 'object') {
	    return _assign(new x.constructor(), x);
	  } else {
	    return x;
	  }
	}

	var COMMAND_PUSH = keyOf({ $push: null });
	var COMMAND_UNSHIFT = keyOf({ $unshift: null });
	var COMMAND_SPLICE = keyOf({ $splice: null });
	var COMMAND_SET = keyOf({ $set: null });
	var COMMAND_MERGE = keyOf({ $merge: null });
	var COMMAND_APPLY = keyOf({ $apply: null });

	var ALL_COMMANDS_LIST = [COMMAND_PUSH, COMMAND_UNSHIFT, COMMAND_SPLICE, COMMAND_SET, COMMAND_MERGE, COMMAND_APPLY];

	var ALL_COMMANDS_SET = {};

	ALL_COMMANDS_LIST.forEach(function (command) {
	  ALL_COMMANDS_SET[command] = true;
	});

	function invariantArrayCase(value, spec, command) {
	  !Array.isArray(value) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected target of %s to be an array; got %s.', command, value) : _prodInvariant('1', command, value) : void 0;
	  var specValue = spec[command];
	  !Array.isArray(specValue) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be an array; got %s. Did you forget to wrap your parameter in an array?', command, specValue) : _prodInvariant('2', command, specValue) : void 0;
	}

	/**
	 * Returns a updated shallow copy of an object without mutating the original.
	 * See https://facebook.github.io/react/docs/update.html for details.
	 */
	function update(value, spec) {
	  !(typeof spec === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): You provided a key path to update() that did not contain one of %s. Did you forget to include {%s: ...}?', ALL_COMMANDS_LIST.join(', '), COMMAND_SET) : _prodInvariant('3', ALL_COMMANDS_LIST.join(', '), COMMAND_SET) : void 0;

	  if (hasOwnProperty.call(spec, COMMAND_SET)) {
	    !(Object.keys(spec).length === 1) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot have more than one key in an object with %s', COMMAND_SET) : _prodInvariant('4', COMMAND_SET) : void 0;

	    return spec[COMMAND_SET];
	  }

	  var nextValue = shallowCopy(value);

	  if (hasOwnProperty.call(spec, COMMAND_MERGE)) {
	    var mergeObj = spec[COMMAND_MERGE];
	    !(mergeObj && typeof mergeObj === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): %s expects a spec of type \'object\'; got %s', COMMAND_MERGE, mergeObj) : _prodInvariant('5', COMMAND_MERGE, mergeObj) : void 0;
	    !(nextValue && typeof nextValue === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): %s expects a target of type \'object\'; got %s', COMMAND_MERGE, nextValue) : _prodInvariant('6', COMMAND_MERGE, nextValue) : void 0;
	    _assign(nextValue, spec[COMMAND_MERGE]);
	  }

	  if (hasOwnProperty.call(spec, COMMAND_PUSH)) {
	    invariantArrayCase(value, spec, COMMAND_PUSH);
	    spec[COMMAND_PUSH].forEach(function (item) {
	      nextValue.push(item);
	    });
	  }

	  if (hasOwnProperty.call(spec, COMMAND_UNSHIFT)) {
	    invariantArrayCase(value, spec, COMMAND_UNSHIFT);
	    spec[COMMAND_UNSHIFT].forEach(function (item) {
	      nextValue.unshift(item);
	    });
	  }

	  if (hasOwnProperty.call(spec, COMMAND_SPLICE)) {
	    !Array.isArray(value) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected %s target to be an array; got %s', COMMAND_SPLICE, value) : _prodInvariant('7', COMMAND_SPLICE, value) : void 0;
	    !Array.isArray(spec[COMMAND_SPLICE]) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be an array of arrays; got %s. Did you forget to wrap your parameters in an array?', COMMAND_SPLICE, spec[COMMAND_SPLICE]) : _prodInvariant('8', COMMAND_SPLICE, spec[COMMAND_SPLICE]) : void 0;
	    spec[COMMAND_SPLICE].forEach(function (args) {
	      !Array.isArray(args) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be an array of arrays; got %s. Did you forget to wrap your parameters in an array?', COMMAND_SPLICE, spec[COMMAND_SPLICE]) : _prodInvariant('8', COMMAND_SPLICE, spec[COMMAND_SPLICE]) : void 0;
	      nextValue.splice.apply(nextValue, args);
	    });
	  }

	  if (hasOwnProperty.call(spec, COMMAND_APPLY)) {
	    !(typeof spec[COMMAND_APPLY] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be a function; got %s.', COMMAND_APPLY, spec[COMMAND_APPLY]) : _prodInvariant('9', COMMAND_APPLY, spec[COMMAND_APPLY]) : void 0;
	    nextValue = spec[COMMAND_APPLY](nextValue);
	  }

	  for (var k in spec) {
	    if (!(ALL_COMMANDS_SET.hasOwnProperty(k) && ALL_COMMANDS_SET[k])) {
	      nextValue[k] = update(value[k], spec[k]);
	    }
	  }

	  return nextValue;
	}

	module.exports = update;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ },
/* 15 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	(function () {
	    try {
	        cachedSetTimeout = setTimeout;
	    } catch (e) {
	        cachedSetTimeout = function () {
	            throw new Error('setTimeout is not defined');
	        }
	    }
	    try {
	        cachedClearTimeout = clearTimeout;
	    } catch (e) {
	        cachedClearTimeout = function () {
	            throw new Error('clearTimeout is not defined');
	        }
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        return setTimeout(fun, 0);
	    } else {
	        return cachedSetTimeout.call(null, fun, 0);
	    }
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        clearTimeout(marker);
	    } else {
	        cachedClearTimeout.call(null, marker);
	    }
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 16 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule reactProdInvariant
	 * 
	 */
	'use strict';

	/**
	 * WARNING: DO NOT manually require this module.
	 * This is a replacement for `invariant(...)` used by the error code system
	 * and will _only_ be required by the corresponding babel pass.
	 * It always throws.
	 */

	function reactProdInvariant(code) {
	  var argCount = arguments.length - 1;

	  var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

	  for (var argIdx = 0; argIdx < argCount; argIdx++) {
	    message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
	  }

	  message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

	  var error = new Error(message);
	  error.name = 'Invariant Violation';
	  error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

	  throw error;
	}

	module.exports = reactProdInvariant;

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	/**
	 * Allows extraction of a minified key. Let's the build system minify keys
	 * without losing the ability to dynamically use key strings as values
	 * themselves. Pass in an object with a single key/val pair and it will return
	 * you the string key of that single record. Suppose you want to grab the
	 * value for a key 'className' inside of an object. Key/val minification may
	 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
	 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
	 * reuse those resolutions.
	 */
	var keyOf = function keyOf(oneKeyObj) {
	  var key;
	  for (key in oneKeyObj) {
	    if (!oneKeyObj.hasOwnProperty(key)) {
	      continue;
	    }
	    return key;
	  }
	  return null;
	};

	module.exports = keyOf;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	function invariant(condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _reactRouter = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	if (!React) var React = __webpack_require__(4); // only require React if need be (server-side rendering)

	var store = __webpack_require__(10),
	    actions = __webpack_require__(6),
	    endpoints = __webpack_require__(9),
	    TaskListItem = __webpack_require__(21),
	    ArchiveButton = __webpack_require__(23),
	    DeleteButton = __webpack_require__(24),
	    helpers = __webpack_require__(22);

	var ToDoForm = function (_React$Component) {
	  _inherits(ToDoForm, _React$Component);

	  function ToDoForm(props) {
	    _classCallCheck(this, ToDoForm);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ToDoForm).call(this, props));

	    _this.state = {
	      newTask: '',
	      action: actions.ADDTASK
	    };
	    return _this;
	  }

	  _createClass(ToDoForm, [{
	    key: 'getInitialProps',
	    value: function getInitialProps() {
	      return {
	        showResetSave: false,
	        hideArchived: true
	      };
	    }
	  }, {
	    key: 'fetchData',
	    value: function fetchData() {
	      store.dispatch(actions.fetchToDoList());
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      // right before the component draws reach out to server to update todo list just incase it changed
	      if (helpers.serverSideRendering) return;
	      try {
	        if (performance.now() > store.getState().viewProps.staleTime) this.fetchData();
	      } catch (e) {}
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      try {
	        ReactDOM.findDOMNode(this.refs.newItem).focus();
	      } catch (e) {}
	    }
	  }, {
	    key: 'getCompletedTasks',
	    value: function getCompletedTasks() {
	      return this.props.tasks.filter(function (task, index) {
	        return task.completed;
	      });
	    }
	  }, {
	    key: 'getUncompletedTasks',
	    value: function getUncompletedTasks() {
	      return this.props.tasks.filter(function (task, index) {
	        return !task.completed;
	      });
	    }
	  }, {
	    key: 'getCompletedTaskIds',
	    value: function getCompletedTaskIds() {
	      var completedTasks = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

	      return (completedTasks || getUncompletedTasks()).map(function (task) {
	        return task.id;
	      });
	    }
	  }, {
	    key: 'getUncompletedTaskIds',
	    value: function getUncompletedTaskIds() {
	      var uncompletedTasks = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

	      return (uncompletedTasks || getUncompletedTasks()).map(function (task) {
	        return task.id;
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var props = this.props,
	          tasks = props.tasks,
	          state = this.state,
	          hideArchived = props.hideArchived;

	      if (hideArchived) {
	        tasks = tasks.filter(function (task) {
	          return !task.archived ? task : undefined;
	        });
	      }

	      var completedTasks = this.getCompletedTasks(),
	          uncompletedTasks = this.getUncompletedTasks(),
	          completedTaskIds = this.getCompletedTaskIds(completedTasks),
	          uncompletedTaskIds = this.getUncompletedTaskIds(uncompletedTasks);

	      var tasksExist = tasks.length ? React.createElement(
	        'div',
	        null,
	        React.createElement('hr', null),
	        React.createElement(
	          'p',
	          { className: 'accessibly-hidden' },
	          'You have ',
	          uncompletedTasks.length,
	          ' ',
	          'thing' + (uncompletedTasks.length > 1 ? 's' : ''),
	          ' to do.'
	        ),
	        React.createElement(
	          'p',
	          { className: 'accessibly-hidden' },
	          'Check tasks below to complete, archive, or delete them.'
	        )
	      ) : false;

	      var resetSave = props.showResetSave ? React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'button',
	          { type: 'reset' },
	          'Reset'
	        ),
	        React.createElement(
	          'button',
	          { type: 'submit' },
	          'Save'
	        )
	      ) : false;

	      var tasksList = tasks.map(function (task, index) {
	        return React.createElement(TaskListItem, { task: task, key: task.id, onChange: function onChange(event) {
	            store.dispatch(actions.toggleTasksCompletion([task.id], event.target.checked));
	          } });
	      });

	      var footer = tasks.length ? React.createElement(
	        'footer',
	        null,
	        resetSave,
	        React.createElement(ArchiveButton, { disabled: !helpers.serverSideRendering && !completedTasks.length, text: completedTasks.length > 1 ? "Archive Completed Tasks" : "Archive Completed Task", onClick: function onClick(event) {
	            _this2.setState({
	              action: actions.ARCHIVETASKS
	            });
	          } }),
	        React.createElement(DeleteButton, { disabled: !helpers.serverSideRendering && !completedTasks.length, text: completedTasks.length > 1 ? "Delete Completed Tasks" : "Delete Completed Task", onClick: function onClick(event) {
	            _this2.setState({
	              action: actions.DELETETASKS
	            });
	          } })
	      ) : false;

	      var loadArchivedTasksLink = !helpers.serverSideRendering ? React.createElement(
	        _reactRouter.Link,
	        { to: '/archive', className: 'btn' },
	        'Load archived tasks'
	      ) : React.createElement(
	        'a',
	        { href: '/archive', className: 'btn' },
	        'Load archived tasks'
	      ),
	          loadArchivedTasks = props.archivedTasks.length ? React.createElement(
	        'p',
	        { className: 'balanced view-all' },
	        loadArchivedTasksLink,
	        '.'
	      ) : false;

	      return React.createElement(
	        'main',
	        { id: 'task-list', className: 'shell shell-task-list' },
	        React.createElement(
	          'div',
	          { className: 'balanced' },
	          React.createElement(
	            'form',
	            { action: '/', method: 'post', id: 'todo', className: 'box', onSubmit: function onSubmit(event) {
	                event.preventDefault();

	                switch (_this2.state.action) {
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
	                      title: state.newTask
	                    }));
	                    _this2.setState({
	                      newTask: ''
	                    });
	                    break;
	                }
	              } },
	            React.createElement(
	              'header',
	              { className: 'add-item' },
	              React.createElement(
	                'h1',
	                { id: 'task-list' },
	                React.createElement(
	                  'a',
	                  { href: '/', className: 'subtle' },
	                  'Todo List'
	                )
	              ),
	              React.createElement(
	                'label',
	                { htmlFor: 'new-item' },
	                'Add a New Task'
	              ),
	              React.createElement(
	                'div',
	                { className: 'new-item__bar' },
	                React.createElement('input', { ref: 'newItem', value: state.newTask, autoFocus: true, autoComplete: 'off', type: 'text', id: 'new-item', name: 'new-item', placeholder: 'Something to do…', onChange: function onChange(event) {
	                    _this2.setState({
	                      newTask: event.target.value
	                    });
	                  } }),
	                React.createElement(
	                  'button',
	                  { disabled: !state.newTask.length && !helpers.serverSideRendering, type: 'submit', formAction: endpoints.ADD_TASK || "/", formMethod: 'post', onClick: function onClick(event) {
	                      _this2.setState({
	                        action: endpoints.ADDTASK
	                      });
	                    } },
	                  'Add Task'
	                )
	              )
	            ),
	            tasksExist,
	            React.createElement(
	              'ol',
	              { className: 'naked tasks' },
	              tasksList
	            ),
	            footer,
	            loadArchivedTasks
	          )
	        )
	      );
	    }
	  }]);

	  return ToDoForm;
	}(React.Component);

	module.exports = ToDoForm;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	if (!React) var React = __webpack_require__(4); // only require React if need be (server-side rendering)

	var store = __webpack_require__(10),
	    actions = __webpack_require__(6),
	    endpoints = __webpack_require__(9),
	    helpers = __webpack_require__(22);

	var TaskListItem = function TaskListItem(props) {
	  var task = props.task;
	  return React.createElement(
	    'li',
	    { 'data-id': helpers.serverSideRendering ? task.id : undefined },
	    React.createElement(
	      'label',
	      { htmlFor: 'item_' + task.id },
	      React.createElement('input', { id: 'item_' + task.id, name: 'item_' + task.id, type: 'checkbox', checked: task.completed, onChange: props.onChange }),
	      ' ',
	      React.createElement(
	        'span',
	        { className: 'title' },
	        task.title
	      )
	    )
	  );
	};

	module.exports = TaskListItem;

/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";

	module.exports.serverSideRendering = function () {
	  try {
	    return !(document !== undefined);
	  } catch (e) {
	    return true;
	  }
	}();

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	if (!React) var React = __webpack_require__(4); // only require React if need be (server-side rendering)

	var endpoints = __webpack_require__(9);

	var ArchiveButton = function ArchiveButton(props) {
	  return React.createElement(
	    "div",
	    { className: "task-bar" },
	    React.createElement(
	      "button",
	      { type: "submit", disabled: props.disabled, formAction: endpoints.ARCHIVE_COMPLETED_TASKS || '/archive/completed/tasks/', onClick: props.onClick },
	      props.text || 'Archive Selected Tasks'
	    )
	  );
	};

	module.exports = ArchiveButton;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	if (!React) var React = __webpack_require__(4); // only require React if need be (server-side rendering)

	var endpoints = __webpack_require__(9);

	var DeleteButton = function DeleteButton(props) {
	  return React.createElement(
	    "div",
	    { className: "task-bar" },
	    React.createElement(
	      "button",
	      { type: "submit", disabled: props.disabled, formAction: endpoints.DELETE_TASKS || '/delete/completed/tasks/', onClick: props.onClick },
	      props.text || 'Delete Selected Tasks'
	    )
	  );
	};

	module.exports = DeleteButton;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _reactRouter = __webpack_require__(5);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	if (!React) var React = __webpack_require__(4); // only require React if need be (server-side rendering)

	var store = __webpack_require__(10),
	    actions = __webpack_require__(6),
	    endpoints = __webpack_require__(9),
	    TaskListItem = __webpack_require__(21),
	    DeleteButton = __webpack_require__(24),
	    ToDoForm = __webpack_require__(20),
	    helpers = __webpack_require__(22);

	var ArchiveForm = function (_ToDoForm) {
	  _inherits(ArchiveForm, _ToDoForm);

	  function ArchiveForm(props) {
	    _classCallCheck(this, ArchiveForm);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ArchiveForm).call(this, props));

	    _this.state = {
	      action: actions.UNARCHIVETASKS
	    };
	    return _this;
	  }

	  _createClass(ArchiveForm, [{
	    key: 'getInitialProps',
	    value: function getInitialProps() {
	      return {
	        showResetSave: false
	      };
	    }
	  }, {
	    key: 'fetchData',
	    value: function fetchData() {
	      store.dispatch(actions.fetchArchiveList());
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this,
	          _React$createElement;

	      var props = this.props,
	          tasks = props.tasks;

	      var loadAll = props.showLoadAllLink ? React.createElement(
	        'span',
	        null,
	        React.createElement('br', null),
	        React.createElement(
	          'a',
	          { href: endpoints.ARCHIVED_TASKS, className: 'btn' },
	          'Load all archived tasks'
	        ),
	        '.'
	      ) : false;

	      // NOTE: by "completed" we actually mean selected, archived tasks are implicitly complete #janky
	      var completedTasks = this.getCompletedTasks(),
	          uncompletedTasks = this.getUncompletedTasks(),
	          completedTaskIds = this.getCompletedTaskIds(completedTasks),
	          uncompletedTaskIds = this.getUncompletedTaskIds(uncompletedTasks);

	      var tasksExist = tasks.length ? React.createElement(
	        'p',
	        null,
	        'The following completed ',
	        tasks.length > 1 ? 'tasks have' : 'task has',
	        ' been archived.',
	        loadAll
	      ) : false;

	      var tasksList = tasks.map(function (task, index) {
	        return React.createElement(TaskListItem, { task: task, key: task.id, onChange: function onChange(event) {
	            return store.dispatch(actions.toggleArchivedTasksSelected([task.id], event.target.checked));
	          } });
	      });

	      var rest = props.showResetSave ? React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'button',
	          { type: 'reset' },
	          'Reset'
	        )
	      ) : false;
	      var footerTasksExist = tasks.length ? React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'task-bar' },
	          React.createElement(
	            'button',
	            { disabled: !helpers.serverSideRendering && !completedTasks.length, type: 'submit', onClick: function onClick(event) {
	                _this2.setState({
	                  action: actions.UNARCHIVETASKS
	                });
	              } },
	            completedTasks.length > 1 ? 'Unarchive Selected Tasks' : 'Unarchive Selected Task'
	          )
	        ),
	        React.createElement(DeleteButton, { text: completedTasks.length > 1 ? "Delete Completed Tasks" : "Delete Completed Task", disabled: !helpers.serverSideRendering && !completedTasks.length, onClick: function onClick(event) {
	            _this2.setState({
	              action: actions.DELETETASKS
	            });
	          } })
	      ) : React.createElement(
	        'p',
	        null,
	        'There are no archived tasks.'
	      );

	      var footerReturnToLink = !helpers.serverSideRendering ? React.createElement(
	        _reactRouter.Link,
	        { to: '/', className: 'btn' },
	        'Return to Task Manager.'
	      ) : React.createElement(
	        'a',
	        { href: '/', className: 'btn' },
	        'Return to Task Manager.'
	      ),
	          footer = React.createElement(
	        'footer',
	        null,
	        footerTasksExist,
	        React.createElement(
	          'div',
	          { className: 'balanced task-bar' },
	          footerReturnToLink
	        )
	      );

	      return React.createElement(
	        'main',
	        { id: 'task-list', className: 'shell shell-task-list' },
	        React.createElement(
	          'div',
	          { className: 'balanced' },
	          React.createElement(
	            'form',
	            (_React$createElement = { action: endpoints.UPDATE_TASKS, method: 'post', id: 'todo' }, _defineProperty(_React$createElement, 'action', '#'), _defineProperty(_React$createElement, 'method', 'post'), _defineProperty(_React$createElement, 'className', 'box'), _defineProperty(_React$createElement, 'onSubmit', function onSubmit(event) {
	              event.preventDefault();

	              switch (_this2.state.action) {
	                case actions.UNARCHIVETASKS:
	                  store.dispatch(actions.moveTasksFromArchive(completedTasks));
	                  store.dispatch(actions.archiveTasks(completedTaskIds, false, completedTasks));
	                  break;

	                case actions.DELETETASKS:
	                  store.dispatch(actions.deleteTasks(completedTaskIds));
	                  break;
	              }
	            }), _React$createElement),
	            React.createElement('input', { type: 'hidden', name: 'unarchiveselected', value: '1' }),
	            React.createElement(
	              'div',
	              null,
	              React.createElement(
	                'header',
	                null,
	                React.createElement(
	                  'h1',
	                  { id: 'task-list' },
	                  React.createElement(
	                    'a',
	                    { href: '/', className: 'subtle' },
	                    'Archived Tasks'
	                  )
	                )
	              ),
	              React.createElement('hr', null),
	              tasksExist,
	              React.createElement(
	                'p',
	                { className: 'accessibly-hidden' },
	                'Check tasks below to unarchive or delete them.'
	              ),
	              React.createElement(
	                'ol',
	                { className: 'naked archived tasks' },
	                tasksList
	              ),
	              footer
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return ArchiveForm;
	}(ToDoForm);

	module.exports = ArchiveForm;

/***/ }
/******/ ]);