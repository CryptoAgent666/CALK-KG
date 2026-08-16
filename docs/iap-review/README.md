# Скриншоты для ревью IAP

`iap-removeads-ru.png` — для App Store Connect → покупка `removeads_KG` →
Review Information → Screenshot. 1170×2532 (390×844 @3x). Видны кнопка
«Убрать рекламу навсегда — $1.99», подпись про разовую покупку и
обязательная кнопка «Восстановить покупку». Пересняли 16.08.2026 под цену
1,99 USD (в сомах Play цену задать нельзя — валюты нет в списке).

## Как переснять

Блок покупки рендерится только в нативной сборке (`purchasesAvailable()`), а цена
приходит из стора — на вебе оффер скрыт. Поэтому для съёмки временно снимаются оба гейта:

1. В `src/lib/purchases.ts`, в начало `purchasesAvailable()`:
   `if ((globalThis as any).__IAP_SHOT__) return true;`
2. В `src/components/RemoveAdsButton.tsx`, перед вызовом `getRemoveAdsPrice()`:
   `if ((globalThis as any).__IAP_SHOT__) return;` — чтобы цена осталась fallback-овой.
3. В `index.html` сразу после `<body>`: `<script>window.__IAP_SHOT__=true;</script>`
4. `npm run dev` → снять скриншот (см. скрипт ниже) → **вернуть все три правки**.

Скрипт съёмки (положить в корень проекта, иначе не найдёт puppeteer; Chrome —
системный, т.к. puppeteer свой не скачан):

```js
import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
await page.goto('http://localhost:5178/', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1500));
await page.evaluate(() => {                       // закрыть cookie-баннер
  const a = [...document.querySelectorAll('button')].find(b => /принять/i.test(b.innerText||''));
  if (a) a.click();
});
await new Promise(r => setTimeout(r, 400));
await page.evaluate(() => document.querySelector('button[aria-label="Открыть меню"]')?.click());
await new Promise(r => setTimeout(r, 900));
await page.evaluate(() => {                       // подвести блок покупки в центр кадра
  const box = [...document.querySelectorAll('div')].find(d =>
    (d.innerText||'').includes('Убрать рекламу навсегда') && (d.className||'').includes('rounded-xl'));
  box?.scrollIntoView({ block: 'center' });
});
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'docs/iap-review/iap-removeads-ru.png' });
await browser.close();
```

⚠️ Цена на скриншоте — `REMOVE_ADS_FALLBACK_PRICE` из `src/lib/purchases.ts`.
Она должна совпадать с ценой продукта в консолях, иначе на скриншоте и в
приложении будут разные суммы. Когда появится сборка с рабочим RevenueCat,
скриншот лучше переснять уже с живой ценой из стора.
