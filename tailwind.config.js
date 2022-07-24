const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	content: [
	  "./index.html",
	  "./src/**/*.{vue,js,ts,jsx,tsx}",
	],
	theme: {
		fontFamily: {
			'sans': ['Inter', ...defaultTheme.fontFamily.sans],
			'sans-rounded': ['Asap', ...defaultTheme.fontFamily.sans]
		}
	},
	plugins: [
		require('@tailwindcss/line-clamp')
	],
  }