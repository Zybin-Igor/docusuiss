import { defineConfig } from 'vite';

// Настройки сборщика Vite.
// base: './' — пути к файлам будут относительными,
// поэтому собранный сайт откроется с любого хостинга и из любой папки.
export default defineConfig({
  base: './',
  css: {
    preprocessorOptions: {
      scss: {
        // Современный компилятор Sass (быстрее и без предупреждений)
        api: 'modern-compiler',
      },
    },
  },
});
