module.exports = {
	plugins: {
		'postcss-flexbugs-fixes': {},
		'autoprefixer': {
		  overrideBrowserslist: [
			"Android 4.1",
			"iOS 7.1",
			"Chrome > 31",
			"ff > 31",
			"ie >= 8"
		  ]
		}
	}
}