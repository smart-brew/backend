CREATE TABLE IF NOT EXISTS senzory (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO senzory VALUES (1, 'teplotny');
INSERT INTO senzory VALUES (2, 'tlakovy');