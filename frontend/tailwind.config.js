/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"task-red": "#ff0033",
				"task-dark": "#1a1a1a",
			},
		},
	},
	plugins: [],
};
