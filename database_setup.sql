CREATE EXTENSION IF NOT EXISTS "pgcrypt"

CREATE TABLE users (
	user_id int NOT NULL,
	user_name VARCHAR(255) NOT NULL UNIQUE,
	PRIMARY KEY (user_id)
	)

CREATE TABLE credentials (
	user_id int NOT NULL,
	password VARCHAR(100),
	FOREIGN KEY (user_id) REFERENCES users(user_id)
	)
