const {join: joinPath} = require("path");
const pgp = require("pg-promise")({});

const sqlFile = function (relativ_path) {
	return new pgp.QueryFile(joinPath(__dirname, relativ_path), {minify: true})
};

module.exports = sqlFile;