# GitHub Push Global

[![Node](https://img.shields.io/node/v/github-push-global.svg?style=flat-square)](https://npmjs.org/package/github-push-global) [![Version](https://img.shields.io/npm/v/github-push-global.svg?style=flat-square)](https://npmjs.org/package/github-push-global) [![Downloads](https://img.shields.io/npm/dt/github-push-global.svg?style=flat-square)](https://npmjs.org/package/github-push-global) 

Commit in all repositories with a command

## Installation

Module available through the [npm registry](https://www.npmjs.com/). It can be installed using the  [`npm`](https://docs.npmjs.com/getting-started/installing-npm-packages-locally) or [`yarn`](https://yarnpkg.com/en/) command line tools.

```sh
# NPM
npm install github-push-global --global
# Or Using Yarn
yarn global add github-push-global
```

## Usage

```sh
# Show Help
github-push-global --help

# Basic
github-push-global \
	--file="code.js" \
	--to="code.js" \
	--github="tiagodanin" \
	--commit="Hello World" \
	--mode="replace" \
	--token="abcdf1234567890"

# Plugin
github-push-global \
	--plugin="plugin-example.js" \
	--to="code.js" \
	--github="tiagodanin" \
	--commit="Hello World" \
	--mode="replace" \
	--token="abcdf1234567890"
```

## Documentation

### API Plugin
See examples in /examples

`Structure`

```js
module.exports = (ctx) => {
	return false // Disable: git push
	return ctx.raw // String: file raw
	return ctx.data // Object: if is .JSON or is .YAML
}
```

#### ctx
```js
const ctx = {
	repo: {
		owner: '',
		name: ''
	},
	data: {
		// If file is JSON or YML, load data here
	},
	raw: '',
	argv: {} // Argv CLI
}
```

## Tests

To run the test suite, first install the dependencies, then run `test`:

```sh
# NPM
npm test
# Or Using Yarn
yarn test
```

## Dependencies

- [@octokit/rest](https://ghub.io/@octokit/rest): GitHub REST API client for Node.js
- [axios](https://ghub.io/axios): Promise based HTTP client for the browser and node.js
- [js-yaml](https://ghub.io/js-yaml): YAML 1.2 parser and serializer
- [meow](https://ghub.io/meow): CLI app helper
- [update-notifier](https://ghub.io/update-notifier): Update notifications for your CLI app

## Dev Dependencies

- [xo](https://ghub.io/xo): JavaScript happiness style linter ❤️

## Contributors

Pull requests and stars are always welcome. For bugs and feature requests, please [create an issue](https://github.com/TiagoDanin/GitHub-Push-Global/issues). [List of all contributors](https://github.com/TiagoDanin/GitHub-Push-Global/graphs/contributors).

## License

[MIT](LICENSE) © [Tiago Danin](https://TiagoDanin.github.io)