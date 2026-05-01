# CALK-KG Worklog

Новые записи добавляются сверху. Время указывать в `KGT (UTC+6)`.

## 2026-03-13 23:58 KGT | calculators | march-2026 docx implementation
- Author: Codex
- Status: done
- Scope: внедрены актуальные данные из `docs/calk-kg-update-march-2026.docx` в расчёты и статический prerender-слой калькуляторов
- Files: src/pages/ElectricityCalculatorPage.tsx, src/pages/PassportCalculatorPage.tsx, src/pages/SocialFundCalculatorPage.tsx, src/pages/SingleTaxCalculatorPage.tsx, src/pages/TaxiTaxCalculatorPage.tsx, src/components/PassportCalculatorArticle.tsx, src/components/SocialFundCalculatorArticle.tsx, src/data/fuelData.ts, src/data/trafficFines.ts, src/pages/ZakatCalculatorPage.tsx, src/i18n/translations.ts, vite.config.ts, docs/2026-03-13-calculator-freshness-audit.md
- Checks: docx извлечён и сопоставлен с кодом; `npm run build` прошёл после обновления React-логики и `vite.config.ts`; в `dist` подтверждены новые тарифы по electricity/fuel, новые ставки single-tax/social-fund, 2% по taxi-tax, новые суммы passport, 70% по traffic-fines и новый nisab zakat
- Deploy: no
- Next: следующими кандидатами на мартовское обновление остаются money-transfer, tourist-fee, customs, mobile-tariffs и pension

## 2026-03-13 20:28 KGT | audit | calculator freshness march-2026
- Author: Codex
- Status: done
- Scope: проведён аудит всех 35 страниц калькуляторов на актуальность расчётов и справочных данных по состоянию на 13.03.2026
- Files: docs/2026-03-13-calculator-freshness-audit.md
- Checks: локальная сверка кода с текущими тарифами, пошлинами, налоговыми режимами и справочными оферами; ключевые расхождения подтверждены внешними источниками
- Deploy: no
- Next: в первую очередь обновить electricity, single-tax, social-fund, passport, money-transfer, traffic-fines, tourist-fee и customs

## 2026-03-13 19:42 KGT | docs | logging policy baseline
- Author: Codex
- Status: done
- Scope: собран единый индекс документации и внедрён обязательный регламент ведения журнала работ для проекта
- Files: docs/README.md, docs/LOGGING_POLICY.md, docs/WORKLOG.md, README_FINAL.md
- Checks: структура документации проверена по текущим markdown-файлам проекта
- Deploy: no
- Next: все следующие изменения фиксировать новыми записями в этом файле
