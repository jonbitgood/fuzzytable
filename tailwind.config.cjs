
/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {},
    content: [
        './src/**/*.{html,js}',
        //'./node_modules/fuzzytable/src/**/*'
    ],
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/aspect-ratio"),
        require("@tailwindcss/typography"),
    ]
};