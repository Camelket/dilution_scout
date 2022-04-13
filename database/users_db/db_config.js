require("dotenv").config();

if (process.env.NODE_ENV == "production") {
	const host = "165.22.25.96"
	const user = "app_user"
	const password = process.env.USERS_DB_PASSWORD
	const port = 5432
	const database = "users_db"
	const config = {
		host: host,
		user: user,
		password: process.env.USERS_DB_PASSWORD,
		port: port,
		database: database,
		connectionString: `postgres://${user}:${password}@${host}:${port}/${database}`
		};
	module.exports = config;
}

if (process.env.NODE_ENV !== "dev"){
	const host = "localhost"
	const user = "postgres"
	const password = "admin"
	const port = 5432
	const database = "users_db"
	const config = {
		host: host,
		user: user,
		password: password,
		port: port,
		database: database,
		connectionString: `postgres://${user}:${password}@${host}:${port}/${database}`
		};
	module.exports = config;
}

