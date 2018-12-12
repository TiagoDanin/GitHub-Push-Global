# GitHub Push Global
Commit in all repositories with a command

## Usage

```bash
$ github-push-global \
	--file="code.js" \
	--to="code.js" \
	--github=tiagodanin \
	--commit="Hello World" \
	--mode=replace/create \
	--token="abcdf1234567890" \
```

## Installation

This is a [Node.js](https://nodejs.org/) module available through the
[npm registry](https://www.npmjs.com/). It can be installed using the
[`npm`](https://docs.npmjs.com/getting-started/installing-npm-packages-locally)
or
[`yarn`](https://yarnpkg.com/en/)
command line tools.

```sh
npm install github-push-global --global
```

## Dependencies

- [@octokit/rest](https://ghub.io/@octokit/rest): GitHub REST API client for Node.js
- [axios](https://ghub.io/axios): Promise based HTTP client for the browser and node.js
- [yargs](https://ghub.io/yargs): yargs the modern, pirate-themed, successor to optimist.

## License

MIT
