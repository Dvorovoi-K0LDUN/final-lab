import React, { useState } from "react";
import Field from "./components/field";
import Translate from "./components/translate";
import "./styles.css";

export default function App() {
  const [text, setText] = useState("");

  return (
    <main className="translator">
      <label htmlFor="russian-word">Введите русское слово</label>
      <Field value={text} onChange={setText} />
      <Translate text={text} />
    </main>
  );
}
