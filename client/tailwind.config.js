/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#FBFBFF',
                primary: '#6a4feb',
                'primary-text': '#190445',
                border: '#1904451a'
            },
        },
    },
    plugins: [],
}

