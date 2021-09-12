const qs = require('querystring');
const db = require('./db');
const template = require('./template');

exports.home = (req, res) => {
	db.query(`SELECT * FROM topic`, (error, topics) => {
		if(error) console.log(error)
		const title = 'Welcome';
		const description = 'Hello, Node.js';
		const list = template.list(topics);
		const html = template.HTML(title, list,
			`<h2>${title}</h2>${description}`,
			`<a href="/create">create</a>`
		);
		res.writeHead(200);
		res.end(html);
	})
}

exports.page = (req, res, queryID) => {
	db.query(`SELECT * FROM topic`, (error, topics) => {
		if(error) throw error;
		db.query(
			`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
			[queryID],
			(errorTopic, topic) => {
			if(errorTopic) throw errorTopic;
			const { title, description, name } = topic[0];
			const list = template.list(topics);
			const html = template.HTML(title, list,
				`
				<h2>${title}</h2>
				${description}
				<p>by ${name}</p>
				`,
				`
				<a href="/create">create</a>
				<a href="/update?id=${queryID}">update</a>
				<form action="delete_process" method="post">
					<input type="hidden" name="id" value="${queryID}">
					<input type="submit" value="delete">
				</form>
				`
			);
			res.writeHead(200);
			res.end(html);
		})	
	})
}

exports.create = (req, res) => {
	db.query(`SELECT * FROM topic`, (error, topics) => {
		if(error) throw error
		db.query(`SELECT * FROM author`, (errorAuthor, authors) => {
			if(errorAuthor) throw errorAuthor
			const title = 'Create';
			const list = template.list(topics);
			const html = template.HTML(title, list,
				`
				<form action="/create_process" method="post">
					<p><input type="text" name="title" placeholder="title"></p>
					<p>
						<textarea name="description" placeholder="description"></textarea>
					</p>
					<p>
						${template.authorSelect(authors, '')}
					</p>
					<p>
						<input type="submit">
					</p>
				</form>
				`,
				`<a href="/create">create</a>`
			);
			res.writeHead(200);
			res.end(html);
		})
	})
}

exports.createProcess = (req, res) => {
	let body = '';
	req.on('data', data => {
		body += data
	});
	req.on('end', () => {
		const post = qs.parse(body);
		db.query(`
			INSERT INTO topic (title, description, created, author_id)
			VALUES (?, ?, NOW(), ?)`,
			[post.title, post.description, post.author],
			(error, result) => {
				if(error) throw error;
				res.writeHead(302, {Location: `/?id=${result.insertId}`});
				res.end();
			}
		)
	});
}

exports.update = (req, res, queryID) => {
	db.query(`SELECT * FROM topic`, (error, topics) => {
		if(error) throw error;
		db.query(
			`SELECT * FROM topic WHERE id=?`,
			[queryID],
			(errorTopic, topic) => {
			if(errorTopic) throw errorTopic;
			db.query(`SELECT * FROM author`, (errorAuthor, authors) => {
				if(errorAuthor) throw errorAuthor
				const { id, title, description, author_id } = topic[0]
				const list = template.list(topics);
				const html = template.HTML(title, list,
				`
					<form action="/update_process" method="post">
						<input type="hidden" name="id" value="${id}">
						<p><input type="text" name="title" placeholder="title" value="${title}"></p>
						<p>
							<textarea name="description" placeholder="description">${description}</textarea>
						</p>
						<p>
							${template.authorSelect(authors, author_id)}
						</p>
						<p>
							<input type="submit">
						</p>
					</form>
					`,
					`<a href="/create">create</a> <a href="/update?id=${id}">update</a>`
				);
				res.writeHead(200);
				res.end(html)
			})
		})
	})
}

exports.updateProcess = (req, res) => {
	let body = '';
	req.on('data', data => {
		body += data;
	});
	req.on('end', () => {
		const { title, description, author, id } = qs.parse(body);
		db.query(
			`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
			[title, description, author, id],
			(error, result) => {
				if(error) throw error;
				res.writeHead(302, {Location: `/?id=${id}`});
				res.end();
			}
		)
	});
}

exports.deleteProcess = (req, res) => {
	let body = '';
	req.on('data', data => {
		body += data;
	});
	req.on('end', () => {
		const { id } = qs.parse(body);
		db.query(
			`DELETE FROM topic WHERE id=?`,
			[id],
			(error, result) => {
			if(error) throw error
			res.writeHead(302, {Location: `/`});
			res.end();
		})
	});
}