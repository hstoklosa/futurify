import defaultTheme from 'tailwindcss/defaultTheme.js';
import plugin from "tailwindcss/plugin";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Lato", ...defaultTheme.fontFamily.sans],
            },
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
    plugins: [
        animate,
        plugin(function ({ matchUtilities, theme }) {
            // REF: https://github.com/tailwindlabs/tailwindcss/discussions/5541#discussioncomment-8819249
            matchUtilities(
                {
                    'auto-fill': (value) => ({
                        gridTemplateColumns: `repeat(auto-fill, minmax(min(${value}, 100%), 1fr))`,
                    }),
                    'auto-fit': (value) => ({
                        gridTemplateColumns: `repeat(auto-fit, minmax(min(${value}, 100%), 1fr))`,
                    }),
                },
                {
                    values: theme('width', {}),
                }
            )
        }),
    ],
}

