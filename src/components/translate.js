import React, { useEffect, useState } from "react";

// В отличие от оригинального примера с Google Translate,
// обращаемся к своему серверному API: ключ Яндекса остаётся на сервере.
export default function Translate({ text }) {
  const [translated, setTranslated] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const word = text.trim();
    setTranslated("");
    setStatus("");

    if (!word) return undefined;

    // По условию переводим одно русское слово (в том числе через дефис).
    if (!/^[а-яё]+(?:-[а-яё]+)*$/iu.test(word)) {
      setStatus("Введите одно слово на русском языке.");
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setStatus("Переводим…");
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: word }),
          signal: controller.signal
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Ошибка перевода");
        }
        if (!controller.signal.aborted) {
          setTranslated(data.translation || "");
          setStatus("");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setStatus("Не удалось получить перевод. Проверьте настройки Yandex API.");
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [text]);

  return (
    <section className="result" aria-label="Перевод на английский">
      <h1 aria-live="polite">{translated}</h1>
      {status && <p role="status">{status}</p>}
    </section>
  );
}
