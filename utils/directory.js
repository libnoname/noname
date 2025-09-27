// 通过比对本地文件来自动修改asset.js和update.js
// 年久失修
//@ts-nocheck

var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;
global.window = global;
require(__dirname + "/update.js");
require(__dirname + "/asset.js");

var updates = window.noname_update;
var newversion = false;
var commit = false;
if (process.argv[2]) {
	if (/[0-9]/.test(process.argv[2][0])) {
		newversion = true;
		updates.update = updates.version;
		updates.version = "1.10." + process.argv[2];
		commit = updates.version;
	} else {
		commit = process.argv[2];
	}
}
var assetlist = "";
var skinlist = "window.noname_skin_list={\n";
var entrylist = [];
var entrymap = {};
var get = function (dir, callback) {
	fs.readdir(dir, function (err, list) {
		var shift = function () {
			if (list.length) {
				var filename = list.shift();
				var delay = false;
				if (!/\.|~|_/.test(filename[0])) {
					var url = dir + "/" + filename;
					var stat = fs.statSync(url);
					if (stat.isFile()) {
						if (
							[".jpg", ".png", ".mp3", ".ttf"].indexOf(
								path.extname(url)
							) != -1
						) {
							var assetentry = path.relative(
								path.dirname(__dirname),
								url
							);
							assetlist += ",\n\t'" + assetentry + "'";
							entrylist.push(assetentry);
						}
					} else if (stat.isDirectory()) {
						if (dir == path.dirname(__dirname) + "/image/skin") {
							fs.readdir(url, function (err, list) {
								var num = 0;
								for (var i = 0; i < list.length; i++) {
									var url2 = url + "/" + list[i];
									var stat = fs.statSync(url2);
									if (
										stat.isFile() &&
										path.extname(url2) == ".jpg"
									) {
										num++;
									}
								}
								skinlist += "\t" + filename + ":" + num + ",\n";
								entrymap[filename] = num;
								shift();
							});
							delay = true;
						} else {
							get(url, shift);
							delay = true;
						}
					}
				}
				if (!delay) {
					shift();
				}
			} else {
				callback();
			}
		};
		shift();
	});
};

get(path.dirname(__dirname), function () {
	var diff = false;
	if (window.noname_asset_list.length == entrylist.length + 1) {
		for (var i = 0; i < entrylist.length; i++) {
			if (entrylist[i] != window.noname_asset_list[i + 1]) {
				diff = true;
				break;
			}
		}
		if (!diff) {
			for (var i in entrymap) {
				if (window.noname_skin_list[i] !== entrymap[i]) {
					diff = true;
					break;
				}
			}
			for (var i in noname_skin_list) {
				if (window.noname_skin_list[i] !== entrymap[i]) {
					diff = true;
					break;
				}
			}
		}
	} else {
		diff = true;
	}
	var next = function () {
		exec("git diff --name-only", (error, stdout, stderr) => {
			var updatelist =
				"window.noname_update={\n\tversion:'" + updates.version + "',";
			updatelist += "\n\tupdate:'" + (updates.update || "") + "',";
			var apply = function (name, list) {
				updatelist += "\n\t" + name + ":[\n";
				for (var i = 0; i < list.length; i++) {
					updatelist += "\t\t'" + list[i] + "'";
					if (i < list.length - 1) {
						updatelist += ",";
					}
					updatelist += "\n";
				}
				updatelist += "\t]";
			};
			if (updates.changeLog) {
				apply("changeLog", updates.changeLog);
				updatelist += ",";
			}
			if (updates.players) {
				apply("players", updates.players);
				updatelist += ",";
			}
			if (updates.cards) {
				apply("cards", updates.cards);
				updatelist += ",";
			}
			var changes = stdout.split("\n");
			for (var i = 0; i < changes.length; i++) {
				var extname = path.extname(changes[i]);
				if (
					!changes[i] ||
					(extname != ".js" && extname != ".css") ||
					changes[i] == "game/update.js"
				) {
					changes.splice(i--, 1);
				}
			}
			var files;
			if (newversion) {
				files = [];
			} else {
				files = updates.files || [];
			}
			for (var i = 0; i < changes.length; i++) {
				if (files.indexOf(changes[i]) === -1) {
					files.push(changes[i]);
				}
			}
			files.sort(function (a, b) {
				if (a > b) {return 1;}
				if (a < b) {return -1;}
				return 0;
			});
			apply("files", files);
			fs.writeFile(
				"game/update.js",
				updatelist + "\n};",
				"utf-8",
				function () {
					console.log("updated update.js");
					if (commit && typeof commit === "string") {
						exec("git add . && git commit -am " + commit);
						console.log("committed " + commit);
					}
				}
			);
		});
	};
	if (diff) {
		var assetversion =
			"window.noname_asset_list=[\n\t'" + updates.version + "'";
		fs.writeFile(
			"game/asset.js",
			assetversion +
				assetlist +
				"\n];\n" +
				skinlist.slice(0, skinlist.length - 2) +
				"\n};",
			"utf-8",
			function () {
				console.log("udpated asset.js");
				next();
			}
		);
	} else {
		next();
	}
});
