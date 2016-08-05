Sync Todo
========

Progressively Enhanced React Todo List. HTML&ndash;first, Node, Express,&nbsp;PostgreSQL.

## Preview
Have a look at the syncronous endpoints in&nbsp;action.  

![](http://j4p.us/3h1L0B2t3Q1g/todolist.gif)

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

You should now be able to run the Node&nbsp;server!
```bash
npm run serve
```

By default this project runs on port 1187. To run it on a different port use the `PORT` environmental variable:
```bash
PORT=8081 npm run serve #visit http://localhost:8081 in your browser
```

To use a database with a different name use the `PGDATABASE` environmental&nbsp;variable:

```bash
PGDATABASE=anotherdb npm run serve
```
