import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// Превращает путь относительно этого файла в полный путь на диске
const page = (file) => fileURLToPath(new URL(file, import.meta.url));

// Настройки сборщика Vite.
// base: './' — пути к файлам будут относительными,
// поэтому собранный сайт откроется с любого хостинга и из любой папки.
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      // Все страницы сайта. Новую страницу добавляем сюда.
      input: {
        main: page('./index.html'),
        rechtsvorschlag: page('./rechtsvorschlag.html'),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Современный компилятор Sass (быстрее и без предупреждений)
        api: 'modern-compiler',
      },
    },
  },
});
