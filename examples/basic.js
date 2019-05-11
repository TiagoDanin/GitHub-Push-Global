module.exports = ctx => {
	if (ctx.data.name) {
		ctx.data.name = 'Hello'
	} else {
		return false // No git push
	}

	return ctx.data // Or ctx.raw
}
