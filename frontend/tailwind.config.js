/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                maroon: {
                    50: '#fdf2f2',
                    100: '#fde8e8',
                    200: '#fbd5d5',
                    300: '#f8a4a4',
                    400: '#f06b6b',
                    500: '#e53e3e',
                    600: '#c53030',
                    700: '#9b1c1c',
                    800: '#800000',
                    900: '#600000',
                    950: '#3d0000',
                },
                // Keep movexa alias for backward-compat with existing components
                movexa: {
                    50: '#fdf2f2',
                    100: '#fde8e8',
                    200: '#fbd5d5',
                    300: '#f8a4a4',
                    400: '#f06b6b',
                    500: '#c53030',
                    600: '#9b1c1c',
                    700: '#800000',
                    800: '#600000',
                    900: '#3d0000',
                },
                gold: {
                    50: '#fffbea',
                    100: '#fff3c4',
                    200: '#ffe585',
                    300: '#ffd13c',
                    400: '#ffb908',
                    500: '#f49f00',
                    600: '#cc7b00',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'bounce-slow': 'bounce 3s ease-in-out infinite',
                'fadeIn': 'fadeIn 0.5s ease-out',
                'slideUp': 'slideUp 0.6s ease-out',
                'shimmer': 'shimmer 2s infinite linear',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                }
            }
        },
    },
    plugins: [],
}
