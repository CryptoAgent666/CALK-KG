// Серверный вход для пререндера: `vite build --ssr` собирает его в dist-ssr/,
// а scripts/generate-static-html.js рендерит каждую страницу в HTML. Так в
// первичном HTML оказывается тот же текст, что видит пользователь (таблицы,
// FAQ, ссылки на все калькуляторы), а не заглушка из заголовка и описания.
import { Writable } from 'stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App';
import { loadKyTranslations } from './i18n';

export async function render(url: string): Promise<string> {
  await loadKyTranslations();

  return new Promise((resolve, reject) => {
    let html = '';
    let failed = false;
    const stream = renderToPipeableStream(
      <HelmetProvider context={{}}>
        <StaticRouter location={url}>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </StaticRouter>
      </HelmetProvider>,
      {
        // Ждём все lazy-страницы: иначе в HTML попадёт спиннер Suspense.
        onAllReady() {
          if (failed) return;
          const sink = new Writable({
            write(chunk, _encoding, callback) {
              html += chunk.toString();
              callback();
            },
          });
          sink.on('finish', () => resolve(html));
          stream.pipe(sink);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          failed = true;
          reject(error);
        },
      },
    );
  });
}
