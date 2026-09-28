// Серверный вход для пререндера: `vite build --ssr` собирает его в dist-ssr/,
// а scripts/generate-static-html.js рендерит каждую страницу в HTML. Так в
// первичном HTML оказывается тот же текст, что видит пользователь (таблицы,
// FAQ, ссылки на все калькуляторы), а не заглушка из заголовка и описания.
import { Writable } from 'stream';
import { renderToPipeableStream, renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App';
import { loadKyTranslations } from './i18n';

const tree = (url: string) => (
  <HelmetProvider context={{}}>
    <StaticRouter location={url}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </StaticRouter>
  </HelmetProvider>
);

// Потоковый рендер нужен только затем, чтобы дождаться lazy-страниц: вывод
// выбрасываем. Сам поток в React 18 портит кириллицу — когда многобайтный
// символ не влезает в остаток 2-КБ буфера, в HTML уходит хвост буфера из
// нулевых байтов (так в первой сборке 28.09.2026 оказались «таможенно\0\0й»).
const loadLazyPages = (url: string) =>
  new Promise<void>((resolve, reject) => {
    const stream = renderToPipeableStream(tree(url), {
      onAllReady() {
        stream.pipe(new Writable({ write(_chunk, _encoding, callback) { callback(); } }));
        resolve();
      },
      onShellError: reject,
      onError: reject,
    });
  });

export async function render(url: string): Promise<string> {
  await loadKyTranslations();
  await loadLazyPages(url);
  // lazy-модули уже загружены — строковый рендер отдаёт страницу целиком, без спиннера.
  return renderToString(tree(url));
}
