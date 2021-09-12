const http = require('http');
const url = require('url');
const topic = require('./lib/topic');

const app = http.createServer((request, response) => {
	const _url = request.url;
	const queryData = url.parse(_url, true).query;
	const pathname = url.parse(_url, true).pathname;
	if(pathname === '/') {
		queryData.id === undefined
		? topic.home(request, response)
		: topic.page(request, response, queryData.id)
	}
	else if(pathname === '/create') topic.create(request, response)
	else if(pathname === '/create_process') topic.createProcess(request, response)
	else if(pathname === '/update') topic.update(request, response, queryData.id)
	else if(pathname === '/update_process') topic.updateProcess(request, response)
	else if(pathname === '/delete_process') topic.deleteProcess(request, response)
	else {
		response.writeHead(404);
		response.end('Not found');
	}
});
app.listen(3000);
