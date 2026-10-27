# Задание 0054 — kazankov_i

Доработано на основе приложенного React-проекта `react-forked(1).zip`.

- Только **один** `<input>` и **один** `<h1>` на странице.
- `title` страницы: `kazankov_i`.
- При вводе **одного русского слова** через 400 мс автоматически запрашивается перевод `ru → en`.
- Используется официальный **Yandex Translate API v2**, а не Google Translate.
- Серверная функция `/api/translate` скрывает API-ключ. Ошибки логируются при помощи **Winston**, аналога Monolog для Node.js.

## Как получить ключ

Документация Яндекса: https://aistudio.yandex.ru/ru/docs/translate/operations/translate

1. Создайте сервисный аккаунт в Yandex Cloud.
2. Назначьте роль `ai.translate.user` на каталог.
3. Создайте API-ключ для Translate с областью действия `yc.ai.translate.execute`.
4. Сохраните идентификатор каталога (Folder ID).

## Как получить HTTPS-ссылку для сдачи

1. Распакуйте проект и загрузите **содержимое** папки в GitHub-репозиторий.
2. Откройте https://vercel.com/new и импортируйте репозиторий.
3. Укажите **Framework Preset: Create React App**. Build Command: `npm run build`. Output Directory: `build`.
4. Перейдите в **Settings → Environment Variables** и добавьте:
   - `YANDEX_API_KEY` = API-ключ Яндекса;
   - `YANDEX_FOLDER_ID` = идентификатор каталога Яндекса.
5. Выполните **Redeploy** после установки переменных окружения.
6. Откройте полученный адрес, например `https://<имя-проекта>.vercel.app`, введите `привет`, проверьте, что появился английский перевод и заголовок вкладки `kazankov_i`.
7. Именно ваш фактический HTTPS-адрес отправьте как ответ на задание.

**Важно:** ключ нельзя помещать в `src/`, `public/`, `REACT_APP_*` или в GitHub. Весь обмен с Яндексом выполняется на стороне Vercel.

## Примечание о локальном запуске

`npm install && npm start` запустит React-интерфейс локально, но не серверную функцию `/api/translate` (она работает в Vercel). Для полного локального запуска используйте `vercel dev` и переменные окружения проекта.

## Официальная документация

- [Yandex Translate API](https://aistudio.yandex.ru/ru/docs/translate/api-ref/Translation/translate)
- [Winston](https://github.com/winstonjs/winston)
- [Vercel Node.js Functions](https://vercel.com/docs/functions/runtimes/node-js)
