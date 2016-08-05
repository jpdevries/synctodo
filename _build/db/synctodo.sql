DROP TABLE IF EXISTS "tasks";

CREATE TABLE "tasks"(
  id SERIAL PRIMARY KEY,
  title varchar(255) NOT NULL DEFAULT '',
  completed smallint NOT NULL DEFAULT '0',
  archived smallint NOT NULL DEFAULT '0'
);

INSERT INTO "tasks" (title,completed)
  VALUES('Eat Bacon',1);

SELECT * FROM "tasks" ORDER BY id;
