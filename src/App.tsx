import { ChangeEvent, useState } from "react";
import { parseRunScreenshot, RunParseResult } from "./api/runParserApi";

function formatSeconds(totalSeconds: number | null) {
  if (totalSeconds == null) {
    return "Не распознано";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
  }

  return [minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export default function App() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [result, setResult] = useState<RunParseResult | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setResult(null);
    setError("");

    if (!file) {
      setPreviewUrl(null);
      setImageDataUrl(null);
      setFileName("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPreviewUrl(null);
      setImageDataUrl(null);
      setFileName("");
      setError("Нужен PNG, JPG или другой файл изображения.");
      return;
    }

    const nextDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
      reader.readAsDataURL(file);
    });

    setFileName(file.name);
    setPreviewUrl(nextDataUrl);
    setImageDataUrl(nextDataUrl);
  }

  async function handleSubmit() {
    if (!imageDataUrl) {
      setError("Сначала загрузите скриншот.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const nextResult = await parseRunScreenshot(imageDataUrl);
      setResult(nextResult);
    } catch (nextError) {
      setResult(null);
      setError(nextError instanceof Error ? nextError.message : "Не удалось обработать скриншот");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Run Screenshot Parser</p>
          <h1>Загрузите скриншот пробежки и получите дистанцию и время через OpenAI API.</h1>
          <p className="hero-text">
            MVP уже заточен под скриншоты с бегового девайса: отправляем изображение в модель, требуем строгий JSON и
            показываем два числа без ручного разбора.
          </p>
          <div className="hero-note">
            Для работы нужен `OPENAI_API_KEY` в окружении backend. Модель по умолчанию: `gpt-4o-mini`.
          </div>
        </div>

        <div className="upload-card">
          <label className="upload-dropzone">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <span className="upload-title">Выбрать скриншот</span>
            <span className="upload-subtitle">PNG, JPG, WebP. Лучше без сильного блюра и обрезки.</span>
          </label>

          <button className="primary-button" type="button" onClick={handleSubmit} disabled={!imageDataUrl || isLoading}>
            {isLoading ? "Распознаём..." : "Распознать значения"}
          </button>

          {fileName ? <p className="file-pill">{fileName}</p> : null}
          {error ? <p className="status-message is-error">{error}</p> : null}
        </div>
      </section>

      <section className="workspace-grid">
        <article className="preview-card">
          <div className="section-heading">
            <span>Превью</span>
          </div>

          {previewUrl ? (
            <img className="preview-image" src={previewUrl} alt="Загруженный скриншот пробежки" />
          ) : (
            <div className="empty-state">
              <strong>Скриншот пока не загружен</strong>
              <p>После выбора файла здесь появится изображение, которое уйдёт в backend.</p>
            </div>
          )}
        </article>

        <article className="result-card">
          <div className="section-heading">
            <span>Результат</span>
          </div>

          {result ? (
            <div className="metrics-grid">
              <div className="metric-box">
                <span className="metric-label">Дистанция</span>
                <strong>{result.distance_km == null ? "Не распознано" : `${result.distance_km} км`}</strong>
              </div>

              <div className="metric-box">
                <span className="metric-label">Время</span>
                <strong>{result.duration_text ?? formatSeconds(result.duration_seconds)}</strong>
              </div>

              <div className="meta-box">
                <span className="metric-label">Уверенность</span>
                <strong>{Math.round(result.confidence * 100)}%</strong>
              </div>

              <div className="meta-box meta-box-wide">
                <span className="metric-label">Комментарий модели</span>
                <p>{result.notes || "Замечаний нет."}</p>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <strong>Пока нет ответа от модели</strong>
              <p>После отправки покажем два нужных числа и короткий комментарий по качеству распознавания.</p>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
