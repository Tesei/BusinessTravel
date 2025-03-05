
import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
    plugins: [Vue()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.js'],
        // coverage:{
        //     reporter:['text', 'json', 'html'] // change this property to the desired output
        // }
    },
    root: './src',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@ui': fileURLToPath(new URL('./src/components/ui', import.meta.url)),
            '@icons': fileURLToPath(new URL('./src/assets/icons', import.meta.url)),
        },
    },
})
