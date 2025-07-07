const express = require("express");
// const https = require("https");
const minimist = require("minimist");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const path = require("path");

const oneYear = 60 * 1000 * 60 * 24 * 365;

// 解析命令行参数
// 示例: -s --maxAge 100
const argv = minimist(process.argv.slice(2), {
	alias: { server: "s" },
	default: {
		platform: "unknow",
		https: false,
		server: false,
		maxAge: oneYear,
		port: 8089,
		debug: false,
	},
});

if (argv.debug) {
	console.log(`argv:`, argv);
}

app.use(
	bodyParser.json({
		limit: "10240mb",
	})
);
app.use(
	bodyParser.urlencoded({
		limit: "10240mb",
		extended: true, //需明确设置
	})
);
const join = function join(url) {
	return path.join(__dirname, url);
};

const isInProject = function isInProject(url) {
	return path.normalize(join(url)).startsWith(__dirname);
};

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// 全局 中间件  解决所有路由的 跨域问题
app.all("*", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
	res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
	next();
});

// 根据参数设置 maxAge
const maxAge = argv.server && !argv.debug ? argv.maxAge : 0;

app.use(express.static(__dirname, { maxAge: maxAge }));

app.get("/", (req, res) => {
	res.send(fs.readFileSync(join("index.html")));
});

app.get("/createDir", (req, res) => {
	const { dir } = req.query;
	if (!isInProject(dir)) {
		throw new Error(`只能访问${__dirname}的文件或文件夹`);
	}
	if (!fs.existsSync(join(dir))) {
		fs.mkdirSync(join(dir), { recursive: true });
	} else {
		if (!fs.statSync(join(dir)).isDirectory()) {
			throw new Error(`${join(dir)}不是文件夹`);
		}
	}
	res.json(successfulJson(true));
});

app.get("/removeDir", (req, res) => {
	const { dir } = req.query;
	if (!isInProject(dir)) {
		throw new Error(`只能访问${__dirname}的文件或文件夹`);
	}
	if (fs.existsSync(join(dir))) {
		if (!fs.statSync(join(dir)).isDirectory()) {
			throw new Error(`${join(dir)}不是文件夹`);
		}
		fs.rmdirSync(join(dir), { recursive: true });
	}
	res.json(successfulJson(true));
});

app.get("/readFile", (req, res) => {
	const { fileName } = req.query;
	if (!isInProject(fileName)) {
		throw new Error(`只能访问${__dirname}的文件或文件夹`);
	}
	if (fs.existsSync(join(fileName))) {
		res.json(successfulJson(Array.prototype.slice.call(new Uint8Array(fs.readFileSync(join(fileName))))));
	} else {
		res.json(failedJson(404, "文件不存在"));
	}
});

app.get("/readFileAsText", (req, res) => {
	const { fileName } = req.query;
	if (!isInProject(fileName)) {
		throw new Error(`只能访问${__dirname}的文件或文件夹`);
	}
	if (fs.existsSync(join(fileName))) {
		res.json(successfulJson(fs.readFileSync(join(fileName), "utf-8")));
	} else {
		res.json(failedJson(404, "文件不存在"));
	}
});

app.post("/writeFile", (req, res) => {
	const { path: p, data } = req.body;
	if (!isInProject(p)) {
		throw new Error(`只能访问${__dirname}的文件或文件夹`);
	}
	fs.mkdirSync(path.dirname(join(p)), { recursive: true });
	fs.writeFileSync(join(p), Buffer.from(data));
	res.json(successfulJson(true));
});

app.get("/removeFile", (req, res) => {
	const { fileName } = req.query;
	if (!isInProject(fileName)) {
		throw new Error(`只能访问${__dirname}的文件或文件夹`);
	}
	if (!fs.existsSync(join(fileName))) {
		throw new Error(`文件不存在`);
	}
	const stat = fs.statSync(join(fileName));
	if (stat.isDirectory()) {
		throw new Error("不能删除文件夹");
	}
	fs.unlinkSync(join(fileName));
	res.json(successfulJson(true));
});

app.get("/getFileList", (req, res) => {
	const { dir } = req.query;
	if (!isInProject(dir)) {
		throw new Error(`只能访问${__dirname}的文件或文件夹`);
	}
	if (!fs.existsSync(join(dir))) {
		throw new Error(`文件夹不存在`);
	}
	const stat = fs.statSync(join(dir));
	if (stat.isFile()) {
		throw new Error("getFileList只适用于文件夹而不是文件");
	}
	const files = [],
		folders = [];
	try {
		fs.readdir(join(dir), (err, filelist) => {
			if (err) {
				res.json(failedJson(500, String(err)));
				return;
			}
			for (let i = 0; i < filelist.length; i++) {
				if (filelist[i][0] != "." && filelist[i][0] != "_") {
					if (fs.statSync(join(dir) + "/" + filelist[i]).isDirectory()) {
						folders.push(filelist[i]);
					} else {
						files.push(filelist[i]);
					}
				}
			}
			res.json(successfulJson({ folders, files }));
		});
	} catch (e) {
		res.json(failedJson(500, String(e)));
	}
});

app.get("/checkFile", (req, res) => {
	const { fileName } = req.query;
	if (!isInProject(fileName)) {
		throw new Error(`只能访问${__dirname}的文件或文件夹`);
	}
	try {
		if (fs.statSync(join(fileName)).isFile()) {
			res.json(successfulJson());
		} else {
			res.json(failedJson(404, "不是一个文件"));
		}
	} catch (error) {
		res.json(failedJson(404, "文件不存在或无法访问"));
	}
});

app.get("/checkDir", (req, res) => {
	const { dir } = req.query;
	if (!isInProject(dir)) {
		throw new Error(`只能访问${__dirname}的文件或文件夹`);
	}
	try {
		if (fs.statSync(join(dir)).isDirectory()) {
			res.json(successfulJson());
		} else {
			res.json(failedJson(404, "不是一个文件夹"));
		}
	} catch (error) {
		res.json(failedJson(404, "文件夹不存在或无法访问"));
	}
});

app.use((req, res, next) => {
	res.status(404).send("Sorry can't find that!");
});

app.use(function (err, req, res, next) {
	console.log(err);
	return res.json(failedJson(400, String(err)));
});

const callback = () => {
	console.log(`应用正在使用 ${argv.port} 端口以提供无名杀本地服务器功能!`);
	// if (argv.platform == "unknow") require("child_process").exec(`start ${argv.https ? "https" : "http"}://localhost:${argv.port}/`);
};
// if (argv.https) {
// 	const SSLOptions = {
// 		key: fs.readFileSync(path.join(__dirname, "localhost.decrypted.key")),
// 		cert: fs.readFileSync(path.join(__dirname, "localhost.crt")),
// 	};
// 	const httpsServer = https.createServer(SSLOptions, app);
// 	// 会提示NET::ERR_CERT_AUTHORITY_INVALID
// 	// 但浏览器还是可以访问的
// 	// todo: 解决sw注册问题
// 	httpsServer.listen(argv.port, callback);
// } else {
// 	app.listen(argv.port, callback);
// }
app.listen(argv.port, callback);

class ReturnData {
	success;

	code;

	errorMsg;

	data;

	constructor() {}

	getSuccess() {
		return this.success;
	}

	setSuccess(success) {
		this.success = success;
	}

	getCode() {
		return this.code;
	}

	setCode(errorCode) {
		this.code = errorCode;
	}

	getErrorMsg() {
		return this.errorMsg;
	}

	setErrorMsg(errorMsg) {
		this.errorMsg = errorMsg;
	}

	getData() {
		this.data;
	}

	setData(data) {
		this.data = data;
	}
}

/**
 * Business is successful.
 *
 * @param [data] return data.
 *
 * @return json.
 */
const successfulJson = function successfulJson(data) {
	const returnData = new ReturnData();
	returnData.setSuccess(true);
	returnData.setCode(200);
	returnData.setData(data);
	return returnData;
};

/**
 * Business is failed.
 *
 * @param code error code.
 * @param message message.
 *
 * @return json.
 */
const failedJson = function failedJson(code, message) {
	const returnData = new ReturnData();
	returnData.setSuccess(false);
	returnData.setCode(code);
	returnData.setErrorMsg(message);
	return returnData;
};
