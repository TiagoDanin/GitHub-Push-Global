const trust = [
	'got',
	'axios',
	'request',
	'request-promise-native',
	'debug',
	'telegraf',
	'telegraf-test',
	'meow',
	'update-notifier',
	'xo',
	'ava',
	'choosealicense-list',
	'enquirer',
	'is-online',
	'lodash',
	'minimist',
	'handlebars',
	'express',
	'vue',
	'cross-env',
	'nuxt',
	'uikit',
	'nodemon',
	'node-fetch',
	'@nuxtjs/axios',
	'@nuxtjs/vuetify',
	'env-cmd',
	'npx',
	'cron',
	'similarity',
	'jformat',
	'os-tmpdir',
	'meow',
	'update-notifier',
	'bytelabel',
	'chart.js',
	'expect.js',
	'webpack',
	'webpack-cli',
	'esprima',
	'gettext-parser',
	'@vuikit/icons',
	'@vuikit/theme',
	'vuikit',
	'node-notifier',
	'polybar-helpers'
]

const noPin = deps => {
	Object.keys(deps).map(dep => { // eslint-disable-line array-callback-return
		if (trust.includes(dep)) {
			if (!deps[dep].startsWith('^')) {
				deps[dep] = `^${deps[dep]}`
			}
		}
	})
	return deps
}

module.exports = ctx => {
	if (!ctx.data.dependencies) {
		return false
	}

	ctx.data.dependencies = noPin(ctx.data.dependencies)
	ctx.data.devDependencies = noPin(ctx.data.devDependencies)
	return ctx.data
}
