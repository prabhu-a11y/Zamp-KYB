/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1a1a1a', // Example dark color
                secondary: '#f3f4f6', // Example light color
            },
            keyframes: {
                'grid-flow': {
                    '0%, 100%': { transform: 'translate(0, 0)' },
                    '25%': { transform: 'translate(-2%, -2%)' },
                    '50%': { transform: 'translate(2%, -1%)' },
                    '75%': { transform: 'translate(-1%, 2%)' }
                }
            },
            animation: {
                'grid-flow': 'grid-flow 20s ease-in-out infinite'
            }
        },
    },
    plugins: [],
}