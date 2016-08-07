DROP TABLE IF EXISTS "tasks";

CREATE TABLE "tasks"(
  id SERIAL PRIMARY KEY,
  title varchar(255) NOT NULL DEFAULT '',
  completed smallint NOT NULL DEFAULT '0',
  archived smallint NOT NULL DEFAULT '0'
);
