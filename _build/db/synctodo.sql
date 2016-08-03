DROP TABLE IF EXISTS "synctodo";

DROP SEQUENCE IF EXISTS todo_id_sequence;

CREATE SEQUENCE todo_id_sequence
  start 1
  minvalue 1
  increment 1;

CREATE TABLE "synctodo"(
  id SERIAL PRIMARY KEY,
  title varchar(255) NOT NULL DEFAULT '',
  completed smallint NOT NULL DEFAULT '0'
);

INSERT INTO "synctodo" (title,completed)
  VALUES('Eat Bacon',1);

INSERT INTO "synctodo" (title,completed)
  VALUES('Eat More Bacon',0);

SELECT * FROM "synctodo" ORDER BY id;
