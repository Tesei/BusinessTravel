import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import { fileURLToPath, URL } from 'node:url'

const optionsTime = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    timeZone: 'Europe/Moscow'
}
const currentTime = new Date().toLocaleTimeString('ru-RU', optionsTime)


export default defineConfig({
    define: {
        'import.meta.env.VITE_BUILD_DATE': JSON.stringify(currentTime),
        __VUE_PROD_DEVTOOLS__: true, // Включение Vue DevTools в production
    },
    plugins: [
        nodePolyfills(),
        vue(),
        legacy({
            targets: ['defaults', 'not IE 11'],
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                javascriptEnabled: true,
                additionalData: '@use "@/style/main.scss" as *;',
                api: 'modern-compiler'
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@ui': fileURLToPath(new URL('./src/components/ui', import.meta.url)),
            '@icons': fileURLToPath(new URL('./src/assets/icons', import.meta.url)),
        },
    },
    server: {
        port: 3000,
        open: '/'
    },
    build: {
        minify: 'esbuild',
        sourcemap: true, // Включение Source Maps
    },
})
