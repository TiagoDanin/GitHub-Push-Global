#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const argv = require('yargs').argv
const Client = require('@octokit/rest')

if (!argv.file || !argv.to || !argv.github || !argv.mode || !argv.commit || !argv.token) {
	console.log(`Use: github-push-global \
--file="code.js" \
--to="code.js" \
--github=tiagodanin \
--commit="Hello World" \
--mode=replace/create \
--token="abcdf1234567890" \
	`)
	return
}

const content = fs.readFileSync(path.resolve(argv.file)).toString()
const pathGh = argv.to
const owner = argv.github
const mode = argv.mode
const message = argv.commit
const token = argv.token

var github = new Client({
	debug: false
})
github.authenticate({
	type: 'token',
	token: token
})

console.log(`[>] GitHub Push Global`)
console.log(`[+] Owner          : ${owner}`)
console.log(`[+] File           : ${argv.file}`)
console.log(`[+] To             : ${pathGh}`)
console.log(`[+] Commit message : ${message}`)
console.log(`[+] Mode           : ${mode}`)

console.log('[>] Get list of repos')
github.repos.listForUser({
	username: owner,
	per_page: 100
}).then(async (repos) => {
	var param = {
		owner: owner,
		path: pathGh,
		message: message,
		content: Buffer.from(content).toString('base64')
	}

	for (var repo of repos.data) {
		console.log(`[+] Check repo: ${repo.name}`)
		param.repo = repo.name
		await github.repos.getContents(param).then((res) => {
			var sha = res.data.sha
			if (content == Buffer.from(res.data.content, 'base64').toString()) {
				console.log(`[!] Same file: ${repo.name}`)
				return
			}
			param.sha = sha
			console.log(`[+] Update file: ${repo.name}`)
			return github.repos.updateFile(param)
		}).catch((err) => {
			if (mode == 'create') {
				console.log(`[+] Create file: ${repo.name}`)
				return github.repos.createFile(param)
			} else if (mode == 'replace') {
				console.log(`[!] File not found: ${repo.name}`)
				return
			}
			console.error(`[!] Error: ${err}`)
			return
		})
		console.log(`[+] Done!: ${repo.name}`)
	}
}).catch((err) => {
	console.error(`[!] Error: ${err}`)
	return {
		data: []
	}
})
