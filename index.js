#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const updateNotifier = require('update-notifier')
const meow = require('meow')
const YAML = require('js-yaml')
const GitHub = require('@octokit/rest')

const cli = meow(`
	Usage
		$ github-push-global

	Options
		--plugin, -p   Load plugin
		--file         Local file to upload
		--to           Path to salve in GitHub
		--github       User or organization name
		--commit, -m   Commit message
		--mode         Modes: 'create' or 'replace'
		--token, -t    GitHub token

	Examples
		$ github-push-global \\
			--plugin="examples/trust-packages.js" \\
			--to="package.json" \\
			--github="tiagodanin" \\
			--commit="Hello World" \\
			--mode="replace" \\
			--token="abcdf1234567890"

		$ github-push-global \\
			--file="code.js" \\
			--to="code.js" \\
			--github="tiagodanin" \\
			--commit="Hello World" \\
			--mode="replace" \\
			--token="abcdf1234567890"
`, {
	booleanDefault: '',
	flags: {
		plugin: {
			type: 'string',
			alias: 'p'
		},
		file: {
			type: 'string'
		},
		to: {
			type: 'string'
		},
		github: {
			type: 'string'
		},
		commit: {
			type: 'string',
			alias: 'm'
		},
		mode: {
			type: 'string'
		},
		token: {
			type: 'string',
			alias: 't'
		}
	}
})
updateNotifier({pkg: cli.pkg}).notify()

const argv = cli.flags
if (!argv.to || !argv.github || !argv.mode || !argv.commit || !argv.token) {
	cli.showHelp()
} else if (!(argv.file || argv.plugin)) {
	cli.showHelp()
} else if (!(argv.mode === 'replace' || argv.mode === 'create')) {
	cli.showHelp()
}

const pathFile = path.resolve(argv.file || argv.plugin)
const content = fs.readFileSync(pathFile).toString()
const pathGh = argv.to
const owner = argv.github
const message = argv.commit
const {mode, token} = argv

const github = new GitHub({
	auth: `token ${token}`
})

let p
console.log('[>] GitHub Push Global')
console.log(`[+] Owner          : ${owner}`)
if (argv.file) {
	console.log(`[+] File           : ${argv.file}`)
} else {
	console.log(`[+] Plugin         : ${argv.plugin}`)
	p = require(pathFile)
}

console.log(`[+] To             : ${pathGh}`)
console.log(`[+] Commit message : ${message}`)
console.log(`[+] Mode           : ${mode}`)

const isJson = input => {
	try {
		return JSON.parse(input)
	} catch (error) {
		console.error('[!] Error:', error)
		return false
	}
}

const isYaml = input => {
	try {
		const output = YAML.safeLoad(input)
		if (typeof output === 'object') {
			return output
		}

		return false
	} catch (error) {
		console.error('[!] Error:', error)
		return false
	}
}

const plugin = (param, input) => {
	if (!argv.plugin) {
		return content
	}

	const ctx = {
		repo: {
			owner: param.owner,
			name: param.name
		},
		data: {},
		raw: content,
		argv
	}

	const json = isJson(input)
	if (json) {
		ctx.data = json
	}

	const yaml = isYaml(input)
	if (yaml) {
		ctx.data = yaml
	}

	const output = p(ctx)
	if (!output) {
		return input
	}

	if (typeof output === 'object') {
		if (json) {
			return JSON.stringify(output, null, '\t')
		}

		if (yaml) {
			return YAML.safeDump()
		}

		return input
	}

	return output
}

let perPage = 100
if (argv.dev) {
	perPage = 1
}

console.log('[>] Get list of repos')
github.repos.listForUser({
	username: owner,
	per_page: perPage // eslint-disable-line camelcase
}).then(async repos => {
	const param = {
		owner,
		message,
		path: pathGh
	}

	for (const repo of repos.data) {
		console.log(`[+] Check repo: ${repo.name}`)
		param.repo = repo.name
		if (argv.dev) {
			param.repo = 'testgithub'
		}

		// eslint-disable-next-line no-await-in-loop
		await github.repos.getContents(param).then(res => {
			const {sha} = res.data
			const inputContent = Buffer.from(res.data.content, 'base64').toString()
			const outputContent = plugin(param, inputContent)
			if (outputContent === inputContent) {
				console.log(`[!] Same file: ${repo.name}`)
				return
			}

			param.sha = sha
			param.content = Buffer.from(outputContent).toString('base64')
			console.log(`[+] Update file: ${repo.name}`)
			return github.repos.updateFile(param)
		}).catch(err => {
			param.content = Buffer.from(plugin(param, '')).toString('base64')
			if (mode === 'create') {
				console.log(`[+] Create file: ${repo.name}`)
				return github.repos.createFile(param)
			}

			if (mode === 'replace') {
				console.log(`[!] File not found: ${repo.name}`)
				return
			}

			console.error(`[!] Error: ${err}`)
		})
		console.log(`[+] Done!: ${repo.name}`)
	}
}).catch(err => {
	console.error(`[!] Error: ${err}`)
	return {
		data: []
	}
})
