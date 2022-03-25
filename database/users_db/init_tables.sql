-- DO $$ DECLARE
--     r RECORD;
-- BEGIN
--     FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
--         EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
--     END LOOP;
-- END $$;

CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(255) UNIQUE,
	name VARCHAR(255),
	user_email VARCHAR(255) UNIQUE,
	user_privilege VARCHAR(100) NOT NULL DEFAULT 'user',
	create_time TIMESTAMP
	);

CREATE TABLE IF NOT EXISTS credentials_password (
	id SERIAL,
	user_id SERIAL,
	hashed_password VARCHAR (255),

	CONSTRAINT fk_users_id
		FOREIGN KEY (user_id)
			REFERENCES users(id)
	);

CREATE TABLE IF NOT EXISTS credentials_federated (
	id SERIAL,
	user_id SERIAL,
	provider VARCHAR(255),
	subject VARCHAR(255),
	auth VARCHAR(255),

	CONSTRAINT fk_users_id
		FOREIGN KEY (user_id)
			REFERENCES users(id)
	)
