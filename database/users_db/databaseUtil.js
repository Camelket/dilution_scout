const db = require("./database_connection");
const bcrypt = require("bcrypt")

const encryptPassword = function (password) {
	// add catch for failure to encrypt 
	let hashedPassword = bcrypt.hash(password, 10)
	return hashedPassword
}

async function getUserInfo(db, _id) {
	let user;
	user = await db.one("SELECT * FROM users WHERE id = $1", [_id]);
	return user}

async function getUserIdByEmail(db, userEmail) {
	// before change was: return db.one(same args) within regular function
	let user;
	try{
		user = await db.one("SELECT id FROM users WHERE user_email = $1", [userEmail])
	} catch(e) {console.log(e); 
				return null}
	if (!user) {
		return null;
	} else { return user.id}
}


async function checkUserExists (db, userEmail) {
	try {
	let rv = await getUserIdByEmail(db, userEmail)
	console.log(`checkUserExists found user with userEmail ${userEmail}: id: ${Object.values(rv)}`);
		}
	catch(e) {console.log(`checkUserExists found no user: returned error: ${e}`);
			  return false}
	return true;
	}

async function createPasswordUser(db, userEmail, password, userPrivilege="user", userName=null, name=null) {
	let userId, hashedPassword;
	try {
		userId = await db.one("INSERT INTO users(name, user_email, user_privilege, username) VALUES($1, $2, $3, $4) RETURNING id",
		[name, userEmail, userPrivilege, userName]);
		userId = userId.id;

	} catch(e) {console.log(`couldnt add user to db, e: ${e}`);
				return null, false}
	hashedPassword = encryptPassword(password)
	try {
		await db.none("INSERT INTO credentials_password (user_id, hashed_password) VALUES ($1, $2)",
			[userId, hashedPassword])
	} catch(e) {
		console.log(`couldnt insert password, e: ${e}`)
		return null, false
	}
	return userId, true
}

async function createUser(db, name, userEmail=null, userPrivilege="user", userName=null) {
	try {
		userId = await db.one("INSERT INTO users(name, user_email, user_privilege, username) VALUES($1, $2, $3, $4) RETURNING id",
		[name, userEmail, userPrivilege, userName])
	} catch(e) {console.log(`couldnt add user to db, e: ${e}`);
				return null, false}
	return userId
}

async function userUpdateEmail(db, userId, userEmail) {
	try {
		await db.none("UPDATE users SET user_email = $1 WHERE id = $2",
			[userId, userEmail]);
	} catch(e) {
		console.log(`couldnt update user_email in DB, e: ${e}`);
		return null
	}
}



async function findOrCreateGoogleUser(db, req, res, next) {
	// change all js user_id references to userId for consistency and clearer code
	let user_id = null
	let user = null
	let user_result = null

	for (let key in req.federatedUser) {
		console.log(`${key}: ${req.federatedUser[key]}`)
	}
	try{
		user_id = await db.oneOrNone("SELECT user_id FROM credentials_federated WHERE provider = $1 and subject = $2",
			["www.google.com" , req.federatedUser.id])
	}
	catch(e) {
		next(e)
		}
	if (user_id == null) {
		try {
		user_id = await createUser(db, req.federatedUser.displayName)
		user_id = user_id.id
		} catch(e) {
			 next(e) 
			}
		try {
			await db.oneOrNone("INSERT INTO credentials_federated (provider, subject, user_id) VALUES ($1, $2, $3)", 
				["www.google.com", req.federatedUser.id, user_id])
			await userUpdateEmail(db, user_id, req.federatedUser.email)
		} catch(e) {
			console.log(`user_id from create_block${user_id}`)
			next(e)
			}
		user = {id: user_id,
				name: req.federatedUser.displayName,
				email: req.federatedUser.email}
		req.login(user, function(e) {
			if (e) { return next(e); }; 
			res.redirect("/"); });
	} else {
		try {
			user_result = await db.one("SELECT id, username, name FROM users WHERE id = $1", [ user_id ])
		} catch(e) {
			console.log(`user_id from exists_block${user_id}`)

			next(e)
		}
		user = {
			id: user_result.user_id.toString(),
			username: user_result.username,
			name: user_result.name,
			email: req.federatedUser.email
			};
		console.log(`findOrCreateGoogleUser user that is passed: ${user}`)

		req.login(user, function(e) {if (e) { return next(e)}
			res.redirect("/");
		});
		}

	}

async function compareHashedPassword(db, userId, userPassword) {
	try {
		let row = await db.one("SELECT user_id FROM credentials_password WHERE user_id = $1 AND hashed_password = $2",
								[userId, userPassword])
		if (row) {return true}
		if (!row) {return false}
	} catch(e) {console.log(e, userId);
				return false}
}


async function authenticatePasswordUser(db, userEmail, userPassword) {
	console.log("trying to authenticate via authenticatePasswordUser")
	let user = null;
	let userId = null;
	try {
		userId = await getUserIdByEmail(db, userEmail)
	} catch(e) {
		console.log(e)
		return null
	}
	console.log(`userId: ${userId}`)
	if (!userId) {console.log(`no userId found with email: ${userEmail}`)
				  return null}
	if (userId) {
		try {
			// specifiy hashing algo
			let hashedPassword = bcrypt.hash(userPassword, 10);
			let success = await compareHashedPassword(db, userId, hashedPassword)
 			if (success) {
 				user = await getUserInfo(db, userId)
 				console.log(`returning user: ${user}`)
 				return user}
 			if (!success) {console.log(`failure to authenticate ${userEmail}`);
 						   return null}
 			} catch(e) {console.log(e);
 					return null;}
		}
	}
// return user info including privilege



exports.findOrCreateGoogleUser = findOrCreateGoogleUser;
exports.createPasswordUser = createPasswordUser
exports.checkUserExists = checkUserExists;
exports.getUserInfo = getUserInfo;
exports.getUserIdByEmail = getUserIdByEmail;
exports.authenticatePasswordUser = authenticatePasswordUser;