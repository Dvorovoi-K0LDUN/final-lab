import React from "react";

// Компонент Field из исходного React-проекта.
export default function Field({ value, onChange }) {
  return (
    <input
      id="russian-word"
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Например, привет"
      autoComplete="off"
      spellCheck="false"
      aria-label="Русское слово"
    />
  );
}
