INSERT INTO users (name, user_email) VALUES (${u_name}, ${u_email});
INSERT INTO credentials_password (user_id, hashed_password) VALUES(${user_id}, ${password});
