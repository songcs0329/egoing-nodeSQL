module.exports = {
  HTML(title, list, body, control) {
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
			<a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
	list(topics) {
		const list = topics.reduce((acc, cur) => acc += `<li><a href="/?id=${cur.id}">${cur.title}</a></li>`, '');
    return `<ul>${list}</ul>`;
  },
	authorSelect(authors, authorId) {
		const authorOptions = authors.reduce((acc, cur) => {
			const selected =  cur.id === authorId ? 'selected' : '';
			return acc += `<option value=${cur.id} ${selected}>${cur.name}</option>`
		}, '')
		return `<select name="author">${authorOptions}</select>`
	},
	authorTable(authors) {
		const tableItem = authors.reduce((acc, cur) => {
			return acc += `
				<tr>
					<td>${cur.name}</td>
					<td>${cur.profile}</td>
					<td><a href="/author/update?id=${cur.id}">update</a></td>
					<td>
						<form action="/author/delete_author" method="post">
							<input type="hidden" name="id" value="${cur.id}">
							<input type="submit" value="delete">
						</form>
					</td>
				</tr>
			`
		}, '')
		return `<table>${tableItem}</table>`
	}
}
