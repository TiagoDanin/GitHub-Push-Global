### API Plugin
See examples in /examples

`Structure`

```js
module.exports = ctx => {
	return false // Disable: git push
	return ctx.raw // String: file raw
	return ctx.data // Object: if is .JSON or is .YAML
}
```

#### `ctx` example
```js
const ctx = {
	repo: {
		owner: 'Tiago Danin',
		name: 'GitHub-Push-Global'
	},
	data: {
		name: 'GitHub-Push-Global'
		// ... //
		// If file is JSON or YML, load data here
	},
	raw: '{"name": "GitHub-Push-Global"}',
	argv: {
		op: true
	} // Argv CLI
}
```
