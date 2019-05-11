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
	--plugin="examples/trust-packages.js" \
	--to="code.js" \
	--github="tiagodanin" \
	--commit="Hello World" \
	--mode="replace" \
	--token="abcdf1234567890"
