// Серверная функция Vercel. Использует официальный Yandex Translate API v2.
// Winston — Node.js-аналог Monolog из материалов задания.
const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "warn",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()]
});

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Разрешён только POST." });
  }

  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text || text.length > 100 || !/^[а-яё]+(?:-[а-яё]+)*$/iu.test(text)) {
    return res.status(400).json({ error: "Введите одно русское слово (до 100 символов)." });
  }

  const apiKey = process.env.YANDEX_API_KEY;
  const folderId = process.env.YANDEX_FOLDER_ID;
  if (!apiKey || !folderId) {
    logger.error("Yandex Translate credentials are not configured");
    return res.status(500).json({ error: "Не настроен ключ Yandex Translate API." });
  }

  try {
    const upstream = await fetch(
      "https://translate.api.cloud.yandex.net/translate/v2/translate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Api-Key ${apiKey}`
        },
        body: JSON.stringify({
          folderId,
          sourceLanguageCode: "ru",
          targetLanguageCode: "en",
          texts: [text]
        }),
        signal: AbortSignal.timeout(10000)
      }
    );

    if (!upstream.ok) {
      // Не записываем ни введённое слово, ни ключ, ни тело ответа API.
      logger.warn("Yandex Translate returned an error", { httpStatus: upstream.status });
      return res.status(502).json({ error: "Ошибка Yandex Translate API." });
    }

    const data = await upstream.json();
    const translation = data?.translations?.[0]?.text;
    if (typeof translation !== "string") {
      logger.warn("Yandex Translate returned unexpected response format");
      return res.status(502).json({ error: "Некорректный ответ API." });
    }
    return res.status(200).json({ translation });
  } catch (error) {
    logger.warn("Yandex Translate is not reachable", { reason: error.name });
    return res.status(502).json({ error: "Ошибка соединения с Yandex Translate." });
  }
};
