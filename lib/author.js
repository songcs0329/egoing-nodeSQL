const qs = require('querystring');
const db = require('./db');
const template = require('./template');

exports.home = (req, res) => {
	db.query(`SELECT * FROM topic`, (error, topics) => {
		if(error) throw error;
		db.query(`SELECT * FROM author`, (errorAuthor, authors) => {
			if(errorAuthor) throw errorAuthor;
			const title = 'Authors'
			const list = template.list(topics);
			const html = template.HTML(title, list,
				`
				${template.authorTable(authors)}
				<style>
					table {
						margin: 10px 0;
						border-collapse: collapse;
					}
					td {
						padding: 4px;
						border:1px solid black;
					}
				</style>
				`,
				`<a href="/author/create">create</a>`
			);
				res.writeHead(200);
				res.end(html);
		})
	})
}

exports.create = (req, res) => {
	db.query(`SELECT * FROM topic`, (error, topics) => {
		if(error) throw error;
		const title = 'Create';
		const list = template.list(topics);
		const html = template.HTML(title, list,
			`
			<form action="/author/create_author" method="post">
				<p><input type="text" name="name" placeholder="name"></p>
				<p>
					<textarea name="profile" placeholder="profile"></textarea>
				</p>
				<p>
					<input type="submit">
				</p>
			</form>
			`,
			`<a href="/author/create_author">create</a>`
		);
		res.writeHead(200);
		res.end(html);
	})
}

exports.createAuthor = (req, res) => {
	let body = '';
	req.on('data', data => {
		body += data
	});
	req.on('end', () => {
		const { name, profile } = qs.parse(body);
		db.query(`
			INSERT INTO author (name, profile)
			VALUES (?, ?)`,
			[name, profile],
			(error, result) => {
				if(error) throw error;
				res.writeHead(302, {Location: `/author`});
				res.end();
			}
		)
	})
}

exports.update = (req, res, queryID) => {
	db.query(`SELECT * FROM topic`, (error, topics) => {
		if(error) throw error;
		db.query(
			`SELECT * FROM author WHERE id=?`,
			[queryID],
			(errorAuthor, author) => {
				if(errorAuthor) throw errorAuthor;
				const { id, name, profile } = author[0];
				const title = 'Update';
				const list = template.list(topics);
				const html = template.HTML(title, list,
					`
					<form action="/author/update_author" method="post">
						<input type="hidden" name="id" value="${id}">
						<p><input type="text" name="name" placeholder="name" value=${name}></p>
						<p>
							<textarea name="profile" placeholder="profile">${profile}</textarea>
						</p>
						<p>
							<input type="submit">
						</p>
					</form>
					`,
					`<a href="/author/update_author">update</a>`
				);
				res.writeHead(200);
				res.end(html);
		})
	})
}

exports.updateAuthor = (req, res) => {
	let body = '';
	req.on('data', data => {
		body += data;
	});
	req.on('end', () => {
		const { name, profile, id } = qs.parse(body);
		db.query(
			`UPDATE author SET name=?, profile=? WHERE id=?`,
			[name, profile, id],
			(error, result) => {
				if(error) throw error;
				res.writeHead(302, {Location: `/author`});
				res.end();
			}
		)
	});
}

exports.deleteAuthor = (req, res) => {
	let body = '';
	req.on('data', data => {
		body += data;
	});
	req.on('end', () => {
		const { id } = qs.parse(body)
		db.query(
			`DELETE FROM author WHERE id=?`,
			[id],
			(error, result) => {
			if(error) throw error
			res.writeHead(302, {Location: `/author`});
			res.end();
		})
	})
}