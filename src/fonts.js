// ── ШРИФТЫ СО СВОЕГО САЙТА ──────────────────────────────
//
// Раньше шрифты загружались с Google Fonts: браузер каждого посетителя
// обращался к серверам Google и передавал им свой IP-адрес. По nDSG / GDPR
// это пришлось бы объяснять в политике конфиденциальности.
//
// Теперь шрифты лежат в npm-пакетах Fontsource (папка node_modules).
// При сборке Vite копирует файлы шрифтов в dist/assets — и они
// загружаются с нашего же сайта. Никаких запросов к Google.
//
// «Variable» — вариативный шрифт: один файл содержит все толщины (300–900),
// поэтому не нужно подключать каждую толщину отдельно.
// Названия шрифтов в CSS — с приставкой «Variable», см. base/_variables.scss.
//
// Этот файл подключается в каждой точке входа: main.js и rechtsvorschlag.js.

import '@fontsource-variable/inter'; // основной текст
import '@fontsource-variable/source-serif-4/opsz.css'; // заголовки (с оптическим размером, как было в Google Fonts)
import '@fontsource-variable/source-serif-4/opsz-italic.css'; // курсив в заголовке на главной
import '@fontsource-variable/jetbrains-mono'; // моноширинный: номера шагов, подписи
