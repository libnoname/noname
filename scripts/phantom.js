// 多开客户端，用于测试联机
// 年久失修
//@ts-nocheck

var fs = require('fs');
var webpage = require('webpage')
var load = function(id){
	var page = webpage.create();
	page.settings.userAgent = 'NonameServer';
	page.open('file://'+fs.workingDirectory+'/index.html?server='+id, function(status) {
		if(status !== 'success') {
			console.log(fs.workingDirectory);
			console.log('Unable to access network');
		}
		setInterval(function(){
			if(page.evaluate(function(){
				if(!lib.node||!lib.node.clients||!lib.node.clients.length){
					return true;
				}
				else{
					return false;
				}
			})){
				page.close();
				load(id);
			}
		},600000);
	});
}

load(1);
load(2);
load(3);
