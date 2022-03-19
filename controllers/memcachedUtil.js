const memjs = require("memjs")

const mc = memjs.Client.create("127.0.0.1:11211")
const maxHourlyLoginAttempts = 100;
const maxRecentLoginAttempts = 5;


const getRecentTries = async function(ip, mc) {
	let {value, flags} = await mc.get(ip+"recent")
	console.log(flags)
	return value
}

const getHourlyTries = async function(ip, mc) {
	let {value, flags} = await mc.get(ip+"hourly")
	console.log(flags)
	return value
}

const initRecent = async function(ip, mc) {
	await mc.increment(ip+"recent", 1, {inital: 0, expires: 60})
}

const initHourly = async function(ip, mc) {
	await mc.increment(ip+"hourly", 1, {inital: 0, expires: 3600})
}

const incrementRecent = async function(ip, mc) {
	await mc.increment(ip+"recent", 1)
}

const incrementHourly = async function(ip, mc) {
	await mc.increment(ip+"hourly", 1)
}


const getTries = async function(ip, mc) {
	let recentTries = await getRecentTries(ip, mc)
	let hourlyTries = await getHourlyTries(ip, mc)
	return recentTries, hourlyTries
}

const evaluateLoginAttemptPassword = async function(reqIP) {
	if (reqIP == null) {return null}
	let recentTries, hourlyTries
	let tries = await getTries(reqIP, mc)
	if (tries == null) {
		recentTries = null;
		hourlyTries = null;}
	if (recentTries == null) {
		recenTries = 0;
		await initRecent(reqIP, mc)
		};
	if (hourlyTries == null) {
		hourlyTries = 0;
		await initHourly(reqIP, mc)
		};

	if (hourlyTries > maxHourlyLoginAttempts) {
		return [false, "hourly", hourlyTries]}
/*		 add ip to block list for 1 hour */
	if (recentTries > maxRecentLoginAttempts) {
		return [false, "recent", recentTries]
/*		 add ip to block list for 2 minutes */ }
	await incrementRecent(reqIP, mc)
	await incrementHourly(reqIP, mc)
	return [true, "success", 0]
/* make login attempt */
	
	}
	

exports.evaluateLoginAttemptPassword = evaluateLoginAttemptPassword