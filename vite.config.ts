import { defineConfig } from 'vite';
import path from 'node:path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    root: '.',
    server: {
        open: true,
        host: '127.0.0.1',
        port: 8080,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, './'),
            vue: 'vue/dist/vue.esm-bundler.js',
        },
        extensions: ['.tsx', '.ts', '.js'],
    }
});
