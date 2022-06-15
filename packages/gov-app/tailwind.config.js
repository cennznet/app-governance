const { join } = require("path");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		join(__dirname, "packages/**/pages/**/*.{js,ts,jsx,tsx}"),
		join(__dirname, "packages/**/components/**/*.{js,ts,jsx,tsx}"),
	],
	theme: {
		colors: {
			hero: "#9847FF",
			mid: "#E4D1FF",
			light: "#F5ECFF",
		},

		fontFamily: {
			display: ["apotek", "sans-serif"],
			body: ["gopher", "sans-serif"],
		},

		extend: {
			fontFamily: {
				sans: ["gopher", ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [],
};
