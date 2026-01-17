import React from 'react';
import { HistoricalRate } from '../hooks/useCurrencyRates';

interface CurrencyChartProps {
  data: HistoricalRate[];
  currencyCode: string;
  color?: string;
}

const CurrencyChart: React.FC<CurrencyChartProps> = ({ 
  data, 
  currencyCode, 
  color = '#2563eb' 
}) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 text-center py-8">Нет данных для отображения</div>;
  }

  const width = 800;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Находим min и max значения
  const values = data.map(d => d.rate);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;
  
  // Добавляем отступы 5% сверху и снизу
  const paddedMin = minValue - valueRange * 0.05;
  const paddedMax = maxValue + valueRange * 0.05;
  const paddedRange = paddedMax - paddedMin;

  // Преобразуем данные в координаты SVG
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.rate - paddedMin) / paddedRange) * chartHeight;
    return { x, y, ...d };
  });

  // Создаем путь для линии
  const linePath = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`
  ).join(' ');

  // Создаем путь для области под линией
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - padding.bottom} L ${padding.left},${height - padding.bottom} Z`;

  // Генерируем метки для оси Y (5 значений)
  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const value = paddedMax - (paddedRange / 4) * i;
    return {
      value: value.toFixed(2),
      y: padding.top + (chartHeight / 4) * i
    };
  });

  // Генерируем метки для оси X (показываем каждую 3-ю дату для 7 дней или каждую 5-ю для 30 дней)
  const xLabelInterval = data.length <= 7 ? 1 : Math.floor(data.length / 6);
  const xLabels = points.filter((_, i) => i % xLabelInterval === 0 || i === points.length - 1);

  // Вычисляем изменение курса
  const firstRate = data[0].rate;
  const lastRate = data[data.length - 1].rate;
  const change = lastRate - firstRate;
  const changePercent = (change / firstRate) * 100;
  const isPositive = change >= 0;

  return (
    <div className="w-full">
      {/* Заголовок с изменением */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {lastRate.toFixed(4)} KGS
          </div>
          <div className="text-sm text-gray-500">
            1 {currencyCode} = {lastRate.toFixed(4)} сом
          </div>
        </div>
        <div className={`text-right ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <div className="text-xl font-semibold">
            {isPositive ? '+' : ''}{change.toFixed(4)}
          </div>
          <div className="text-sm">
            {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* График */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 overflow-x-auto">
        <svg 
          width={width} 
          height={height} 
          className="mx-auto"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Сетка по оси Y */}
          {yLabels.map((label, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={label.y}
                x2={width - padding.right}
                y2={label.y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={label.y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#6b7280"
              >
                {label.value}
              </text>
            </g>
          ))}

          {/* Область под линией (gradient fill) */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d={areaPath}
            fill="url(#areaGradient)"
          />

          {/* Линия графика */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Точки на линии */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="white"
              stroke={color}
              strokeWidth="2"
              className="hover:r-6 transition-all cursor-pointer"
            >
              <title>{point.date}: {point.rate.toFixed(4)}</title>
            </circle>
          ))}

          {/* Метки оси X */}
          {xLabels.map((point, i) => (
            <text
              key={i}
              x={point.x}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
            >
              {new Date(point.date).toLocaleDateString('ru-RU', { 
                day: '2-digit', 
                month: 'short' 
              })}
            </text>
          ))}

          {/* Оси */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#9ca3af"
            strokeWidth="1.5"
          />
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#9ca3af"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
};

export default CurrencyChart;
