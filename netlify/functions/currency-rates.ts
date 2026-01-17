import { Handler } from '@netlify/functions';

// Кэш курсов (живет пока функция работает)
let cachedRates: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 3600000; // 1 час в миллисекундах

const handler: Handler = async (event, context) => {
  // Разрешаем CORS для фронтенда
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Обработка preflight запроса
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Проверяем кэш
    const now = Date.now();
    if (cachedRates && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('Returning cached rates');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          ...cachedRates,
          cached: true,
          cacheAge: Math.floor((now - cacheTimestamp) / 1000) + 's'
        }),
      };
    }

    console.log('Fetching fresh rates from NBRK');
    
    // Получаем данные от НБКР
    const response = await fetch('https://www.nbkr.kg/XML/daily.xml');
    
    if (!response.ok) {
      throw new Error(`NBRK API returned ${response.status}`);
    }

    const xmlText = await response.text();
    
    // Парсим XML (простой парсинг без библиотек)
    const rates: any = {};
    const dateMatch = xmlText.match(/<Date\s+Date="([^"]+)"/);
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

    // Извлекаем курсы нужных валют
    const currencies = ['USD', 'EUR', 'RUB', 'KZT', 'CNY'];
    
    currencies.forEach(code => {
      const regex = new RegExp(`<Currency ISOCode="${code}"[^>]*>([\\s\\S]*?)<\\/Currency>`, 'i');
      const match = xmlText.match(regex);
      
      if (match) {
        const currencyBlock = match[1];
        const valueMatch = currencyBlock.match(/<Value>([^<]+)<\/Value>/);
        const nominalMatch = currencyBlock.match(/<Nominal>([^<]+)<\/Nominal>/);
        const titleMatch = currencyBlock.match(/<Title>([^<]+)<\/Title>/);
        
        if (valueMatch) {
          rates[code] = {
            code,
            name: titleMatch ? titleMatch[1] : code,
            rate: parseFloat(valueMatch[1].replace(',', '.')),
            nominal: nominalMatch ? parseInt(nominalMatch[1]) : 1
          };
        }
      }
    });

    const result = {
      date,
      rates,
      timestamp: new Date().toISOString()
    };

    // Кэшируем результат
    cachedRates = result;
    cacheTimestamp = now;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };

  } catch (error: any) {
    console.error('Error fetching currency rates:', error);
    
    // Возвращаем fallback курсы
    return {
      statusCode: 200, // Не 500, чтобы фронтенд мог использовать fallback
      headers,
      body: JSON.stringify({
        date: new Date().toISOString().split('T')[0],
        rates: {
          USD: { code: 'USD', name: 'Доллар США', rate: 87.25, nominal: 1 },
          EUR: { code: 'EUR', name: 'Евро', rate: 95.80, nominal: 1 },
          RUB: { code: 'RUB', name: 'Российский рубль', rate: 0.91, nominal: 1 },
          KZT: { code: 'KZT', name: 'Казахстанский тенге', rate: 0.18, nominal: 1 },
          CNY: { code: 'CNY', name: 'Китайский юань', rate: 12.05, nominal: 1 }
        },
        error: error.message,
        fallback: true,
        timestamp: new Date().toISOString()
      }),
    };
  }
};

export { handler };
