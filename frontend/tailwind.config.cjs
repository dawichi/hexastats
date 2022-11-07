/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            animation: {
                'pulse-fast': 'pulse 0.5s linear infinite',
            },
        },
    },
    plugins: [require('flowbite/plugin')],
    darkMode: 'class',
}
