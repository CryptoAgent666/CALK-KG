import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

const routes = [
  {
    path: '/',
    title: 'Calk.KG - Калькуляторы Кыргызстана',
    description: 'Более 25 бесплатных калькуляторов для жителей Кыргызстана: зарплата, кредиты, ипотека, налоги, коммунальные услуги. Точные расчеты по законам КР.',
    ogImage: 'https://calk.kg/og-images/home.svg'
  },
  {
    path: '/about',
    title: 'О проекте Calk.KG - Калькуляторы для Кыргызстана',
    description: 'Calk.KG - бесплатный сервис онлайн-калькуляторов для жителей Кыргызстана. Узнайте о нашей миссии, команде и как мы помогаем с финансовыми расчетами.',
    ogImage: 'https://calk.kg/og-images/about.svg'
  },
  {
    path: '/privacy-policy',
    title: 'Политика конфиденциальности - Calk.KG',
    description: 'Политика конфиденциальности Calk.KG: как мы собираем, используем и защищаем ваши данные при использовании калькуляторов.',
    ogImage: 'https://calk.kg/og-images/privacy-policy.svg'
  },
  {
    path: '/terms-of-service',
    title: 'Условия использования - Calk.KG',
    description: 'Условия использования сервиса Calk.KG: правила пользования онлайн-калькуляторами, ограничения ответственности.',
    ogImage: 'https://calk.kg/og-images/terms-of-service.svg'
  },
  {
    path: '/sitemap',
    title: 'Карта сайта - Calk.KG',
    description: 'Полный список всех калькуляторов и страниц на Calk.KG. Найдите нужный калькулятор быстро.',
    ogImage: 'https://calk.kg/og-images/sitemap.svg'
  },
  {
    path: '/contact',
    title: 'Контакты - Calk.KG',
    description: 'Свяжитесь с командой Calk.KG. Обратная связь, предложения и вопросы по работе калькуляторов.',
    ogImage: 'https://calk.kg/og-images/contact.svg'
  },
  {
    path: '/disclaimer',
    title: 'Отказ от ответственности - Calk.KG',
    description: 'Отказ от ответственности Calk.KG: ограничения использования онлайн-калькуляторов, информационный характер расчетов, рекомендации по консультации со специалистами.',
    ogImage: 'https://calk.kg/og-images/disclaimer.svg'
  },
  {
    path: '/calculator/salary',
    title: 'Калькулятор заработной платы КР 2025 - Расчет зарплаты "на руки"',
    description: 'Рассчитайте чистую зарплату "на руки" с учетом всех налогов и взносов в Кыргызстане. Подоходный налог 10%, соц. отчисления, пенсионные взносы.',
    ogImage: 'https://calk.kg/og-images/salary.svg'
  },
  {
    path: '/calculator/single-tax',
    title: 'Единый налог для ИП в Кыргызстане 2025 - Калькулятор',
    description: 'Расчет единого налога для индивидуальных предпринимателей в КР. Ставки по видам деятельности, льготы, сроки уплаты.',
    ogImage: 'https://calk.kg/og-images/single-tax.svg'
  },
  {
    path: '/calculator/property-tax',
    title: 'Налог на недвижимость в Кыргызстане 2025 - Калькулятор',
    description: 'Расчет годового налога на жилые дома и квартиры в Кыргызстане. Ставки по регионам, льготы для пенсионеров.',
    ogImage: 'https://calk.kg/og-images/property-tax.svg'
  },
  {
    path: '/calculator/social-fund',
    title: 'Отчисления в Социальный фонд КР 2025 - Калькулятор',
    description: 'Детальный расчет социальных взносов работника и работодателя в Кыргызстане. Пенсионные, страховые отчисления.',
    ogImage: 'https://calk.kg/og-images/social-fund.svg'
  },
  {
    path: '/calculator/pension',
    title: 'Пенсионный калькулятор Кыргызстана 2025 - Расчет пенсии',
    description: 'Рассчитайте будущую пенсию в Кыргызстане. Базовая, страховая и накопительная части пенсии по новой формуле.',
    ogImage: 'https://calk.kg/og-images/pension.svg'
  },
  {
    path: '/calculator/loan',
    title: 'Кредитный калькулятор Кыргызстан 2025 - Расчет кредита',
    description: 'Рассчитайте ежемесячный платеж по кредиту в банках Кыргызстана. Аннуитетный и дифференцированный платеж, переплата.',
    ogImage: 'https://calk.kg/og-images/loan.svg'
  },
  {
    path: '/calculator/mortgage',
    title: 'Ипотечный калькулятор Кыргызстан 2025 - Расчет ипотеки',
    description: 'Расчет ипотеки в банках Кыргызстана. График платежей, первоначальный взнос, процентные ставки, переплата.',
    ogImage: 'https://calk.kg/og-images/mortgage.svg'
  },
  {
    path: '/calculator/auto-loan',
    title: 'Автокредит в Кыргызстане 2025 - Калькулятор',
    description: 'Расчет автокредита в банках Кыргызстана. Ежемесячный платеж, первоначальный взнос, сравнение условий банков.',
    ogImage: 'https://calk.kg/og-images/auto-loan.svg'
  },
  {
    path: '/calculator/deposit',
    title: 'Депозитный калькулятор Кыргызстан 2025 - Расчет вклада',
    description: 'Рассчитайте доходность депозита в банках Кыргызстана. Капитализация процентов, сравнение ставок банков.',
    ogImage: 'https://calk.kg/og-images/deposit.svg'
  },
  {
    path: '/calculator/customs',
    title: 'Растаможка авто в Кыргызстане 2025 - Калькулятор',
    description: 'Рассчитайте стоимость растаможки автомобиля в Кыргызстане. Пошлины, НДС, акциз, утилизационный сбор.',
    ogImage: 'https://calk.kg/og-images/customs.svg'
  },
  {
    path: '/calculator/electricity',
    title: 'Калькулятор электроэнергии Кыргызстан 2025 - Тарифы',
    description: 'Расчет стоимости электроэнергии по тарифам Кыргызстана. Дневной и ночной тариф, социальная норма.',
    ogImage: 'https://calk.kg/og-images/electricity.svg'
  },
  {
    path: '/calculator/water',
    title: 'Калькулятор воды и канализации КР 2025 - Тарифы',
    description: 'Расчет платы за холодную воду и канализацию в Кыргызстане. Тарифы по городам и районам.',
    ogImage: 'https://calk.kg/og-images/water.svg'
  },
  {
    path: '/calculator/heating',
    title: 'Калькулятор отопления и горячей воды КР 2025',
    description: 'Расчет стоимости отопления и горячего водоснабжения в Кыргызстане. Тарифы по площади квартиры.',
    ogImage: 'https://calk.kg/og-images/heating.svg'
  },
  {
    path: '/calculator/gas',
    title: 'Калькулятор газа Кыргызстан 2025 - Тарифы',
    description: 'Расчет платы за природный газ в Кыргызстане. Сезонные тарифы, лимиты потребления, льготы.',
    ogImage: 'https://calk.kg/og-images/gas.svg'
  },
  {
    path: '/calculator/alimony',
    title: 'Калькулятор алиментов Кыргызстан 2025',
    description: 'Расчет размера алиментов на детей по законодательству Кыргызстана. Процент от дохода, фиксированная сумма.',
    ogImage: 'https://calk.kg/og-images/alimony.svg'
  },
  {
    path: '/calculator/family-benefit',
    title: 'Пособие "үй-бүлөгө көмөк" 2025 - Калькулятор',
    description: 'Проверьте право на получение государственного пособия в Кыргызстане и рассчитайте его размер.',
    ogImage: 'https://calk.kg/og-images/family-benefit.svg'
  },
  {
    path: '/calculator/patent',
    title: 'Стоимость патента ИП в Кыргызстане 2025 - Калькулятор',
    description: 'Расчет стоимости патента для ИП по видам деятельности и регионам Кыргызстана.',
    ogImage: 'https://calk.kg/og-images/patent.svg'
  },
  {
    path: '/calculator/traffic-fines',
    title: 'Штрафы ПДД Кыргызстан 2025 - Справочник',
    description: 'Полный справочник штрафов за нарушения ПДД в Кыргызстане. Актуальные размеры штрафов.',
    ogImage: 'https://calk.kg/og-images/traffic-fines.svg'
  },
  {
    path: '/calculator/zakat',
    title: 'Калькулятор закята 2025 - Расчет',
    description: 'Расчет ежегодного религиозного пожертвования (закят) согласно исламским принципам.',
    ogImage: 'https://calk.kg/og-images/zakat.svg'
  },
  {
    path: '/calculator/taxi-tax',
    title: 'Налог для таксистов и курьеров КР 2025',
    description: 'Расчет подоходного налога 1% для работающих через агрегаторы (Яндекс, Максим, Glovo).',
    ogImage: 'https://calk.kg/og-images/taxi-tax.svg'
  },
  {
    path: '/calculator/passport',
    title: 'Стоимость паспорта КР 2025 - Калькулятор',
    description: 'Расчет стоимости и сроков оформления паспорта гражданина Кыргызстана.',
    ogImage: 'https://calk.kg/og-images/passport.svg'
  },
  {
    path: '/calculator/tourist-fee',
    title: 'Туристический сбор Кыргызстан 2025 - Калькулятор',
    description: 'Расчет размера туристического сбора для гостиниц и туристов в городах Кыргызстана.',
    ogImage: 'https://calk.kg/og-images/tourist-fee.svg'
  },
  {
    path: '/calculator/sewing-cost',
    title: 'Себестоимость швейного изделия - Калькулятор',
    description: 'Расчет полной себестоимости швейного изделия с учетом материалов, фурнитуры и работы.',
    ogImage: 'https://calk.kg/og-images/sewing-cost.svg'
  },
  {
    path: '/calculator/housing',
    title: 'Калькулятор стоимости жилья в Кыргызстане 2025',
    description: 'Оцените стоимость покупки или строительства жилья в городах Кыргызстана.',
    ogImage: 'https://calk.kg/og-images/housing.svg'
  },
  {
    path: '/calculator/wedding',
    title: 'Калькулятор тоя (свадьбы) 2025 - Бюджет',
    description: 'Спланируйте бюджет на свадьбу, юбилей и другие торжества с учетом всех расходов в Кыргызстане.',
    ogImage: 'https://calk.kg/og-images/wedding.svg'
  },
  {
    path: '/calculator/calorie',
    title: 'Калькулятор калорий (КБЖУ) 2025',
    description: 'Расчет суточной нормы калорий, белков, жиров и углеводов для похудения или набора массы.',
    ogImage: 'https://calk.kg/og-images/calorie.svg'
  }
];

function generateHtml(templateHtml, route) {
  let html = templateHtml;

  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${route.title}</title>`
  );

  html = html.replace(
    /<meta name="description" content=".*?".*?\/>/,
    `<meta name="description" content="${route.description}" />`
  );

  const ogTags = `
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:url" content="https://calk.kg${route.path === '/' ? '' : route.path}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${route.ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="ru_RU" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
    <meta name="twitter:image" content="${route.ogImage}" />
    <link rel="canonical" href="https://calk.kg${route.path === '/' ? '' : route.path}" />`;

  html = html.replace(
    '</head>',
    `${ogTags}\n  </head>`
  );

  return html;
}

function main() {
  const templatePath = join(distDir, 'index.html');

  if (!existsSync(templatePath)) {
    console.error('Error: dist/index.html not found. Run "vite build" first.');
    process.exit(1);
  }

  const templateHtml = readFileSync(templatePath, 'utf-8');

  console.log('Generating static HTML files...\n');

  for (const route of routes) {
    const html = generateHtml(templateHtml, route);

    if (route.path === '/') {
      writeFileSync(join(distDir, 'index.html'), html);
      console.log(`  / -> dist/index.html`);
    } else {
      const dirPath = join(distDir, route.path);
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
      writeFileSync(join(dirPath, 'index.html'), html);
      console.log(`  ${route.path} -> dist${route.path}/index.html`);
    }
  }

  console.log(`\nGenerated ${routes.length} static HTML files.`);
}

main();
