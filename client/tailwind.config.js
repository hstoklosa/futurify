/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            boxShadow: {
                '3xl': '0px 0px 0px 1px rgb(var(--primary))',
                '4xl': '0px 3px 6px rgba(var(--foreground), 0.05)'
            },
            colors: {
                primary: {
                    DEFAULT: 'rgba(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'rgba(var(--secondary))',
                    // foreground: 'hsl(var(--secondary-foreground))',
                },

                background: 'rgba(var(--background))',
                foreground: 'rgba(var(--foreground))',
                border: 'rgba(var(--border))',
            },
        },
    },
    plugins: [],
}

