Sync Todo
========

Progressively Enhanced React Todo List. HTML&ndash;first, Node, Express,&nbsp;PostgreSQL.

## Preview
Have a look at the synchronous and asynchronous endpoints in&nbsp;action.  

![](http://j4p.us/3L3k0i450J3k/todolist.gif)

## What you need

In order to build our front end assets, you need to have Node.js/npm latest and git 1.7 or later.
(Earlier versions might work OK, but are not tested.)

For Windows you have to download and install [git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/download/).

Mac OS users should install [Homebrew](http://mxcl.github.com/homebrew/). Once Homebrew is installed, run `brew install git` to install git,
and `brew install node` to install Node.js.

Linux/BSD users should use their appropriate package managers to install git and Node.js, or build from source
if you swing that way. Easy-peasy.

Install the [grunt-cli](http://gruntjs.com/getting-started#installing-the-cli) package if you haven't before. These should be done as global installs:

```bash
npm install -g grunt-cli
```

Make sure you have `grunt` installed by testing:

```bash
grunt --version
```

To interact with the application you'll need to be running PostgreSQL for the database. [Install Postgres](https://www.postgresql.org/download/) if you haven't already. Mac users can [install Postgres via brew](https://www.moncefbelyamani.com/how-to-install-postgresql-on-a-mac-with-homebrew-and-lunchy/).

Create a synctodo&nbsp;database.

```
psql
CREATE DATABASE synctodo;
\q
```

 Next import our example&nbsp;data. Data will be impored into a `tasks`&nbsp;table.

```bash
psql synctodo < _build/db/synctodo.sql
```

## Getting Started
First, clone a copy of this git repo by running:

```bash
git clone -b grunt git@github.com:jpdevries/synctodo.git
```

Then cd into the `synctodo` folder and install the Node&nbsp;dependencies:
```bash
cd synctodo
npm install
```

You should now be able to build the files and run the Node&nbsp;server!
```bash
grunt build
npm run serve
```

The server will automatically restart when changes are made. To watch the Sass source files for changes and automatically rebuild the source files, run the `grunt` command:
```bash
grunt #alias for grunt watch
```

By default this project runs on port 1187. To run it on a different port use the `PORT` environmental variable:
```bash
PORT=8081 npm run serve #visit http://localhost:8081 in your browser
```

To use a database with a different name use the `PGDATABASE` environmental&nbsp;variable:

```bash
PGDATABASE=anotherdb npm run serve
```

## Features
 - Add, Complete, Archive, and Delete&nbsp;Tasks
 - Progressive Enhancement (`.no-js`) support
 - Isomorphic HTML layer doubles as a data model for Redux
 - Isomorphic server uses the same promises for asynchronous and synchronous&nbsp;requests
 - React&nbsp;Routing
 - React and Redux used on both server and client&nbsp;side
 - REST API prefetches and fetches data to keep UI&nbsp;fresh
 - Loads dependencies from CDN with local&nbsp;fallback
 - Feature detection to only load scripts if they'll work (IE9+)

### Add New Tasks
Homepage at `/`

![](http://j4p.us/1l1G471R453z/Screen%20Shot%202016-08-06%20at%201.13.46%20AM.png)

### Complete Tasks
Synchronously posts to `/`

![](http://j4p.us/3K3C3R1o3a1b/Screen%20Shot%202016-08-06%20at%201.14.11%20AM.png)

### Archive Tasks
Synchronously posts to `/archive/`

![](http://j4p.us/162W063Y3i0K/Screen%20Shot%202016-08-06%20at%201.14.23%20AM.png)

### Unarchive Tasks
Synchronously posts to `/`

![](http://j4p.us/1o0S0F3I1X0r/Screen%20Shot%202016-08-06%20at%201.14.39%20AM.png)

### Delete Tasks
Synchronously posts to `/delete/tasks/`

![](http://j4p.us/0P2C3h2n070H/Screen%20Shot%202016-08-06%20at%201.14.55%20AM.png)

## Database
A simple PostgreSQL database schema is used to store our tasks. See `server.js` for the queries that interact with the database to add, complete, archive, unarchive, and delete&nbsp;tasks.

```sql
CREATE TABLE "tasks" (
  id SERIAL PRIMARY KEY,
  title varchar(255) NOT NULL DEFAULT '',
  completed smallint NOT NULL DEFAULT '0',
  archived smallint NOT NULL DEFAULT '0'
);
```

## Accessibility Proclaimer
This component strives for WCAG 2.0 Guidelines Level AA. Please [open an issue](https://github.com/jpdevries/synctodo/issues/new) for any accessibility issue, feedback, or&nbsp;concern.
