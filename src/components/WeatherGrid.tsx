import React from 'react';
import { CloudSun, Droplets, Wind, Sun, Sunrise, Sunset, Compass } from 'lucide-react';
import { WeatherData } from '../types';
import { getBeaufortScale, decodeWMOWeatherCode } from '../utils/hydroLogic';

interface WeatherGridProps {
  weather: WeatherData;
  isNightMode?: boolean;
}

export const WeatherGrid: React.FC<WeatherGridProps> = ({ weather, isNightMode = false }) => {
  const {
    airTemp,
    apparentTemp,
    estimatedWaterTemp,
    windSpeedKmh,
    windGustsKmh,
    windDirDeg,
    windDirCardinal,
    precipNow,
    precip3h,
    uvNow,
    uvMax,
    weatherCode,
    sunrise,
    sunset,
  } = weather;

  const beaufort = getBeaufortScale(windSpeedKmh);
  const conditionLabel = decodeWMOWeatherCode(weatherCode);

  const cardBg = isNightMode
    ? 'bg-[#121A2D] border-[#1E2942] text-white shadow-sm'
    : 'bg-white border-slate-300 text-slate-900 shadow-sm';

  const labelColor = isNightMode ? 'text-slate-400' : 'text-slate-700';
  const unitColor = isNightMode ? 'text-slate-400' : 'text-slate-600';
  const primaryNumberColor = isNightMode ? 'text-white' : 'text-slate-950';

  return (
    <div className="space-y-3">
      {/* Header with Condition */}
      <div className="flex items-center justify-between px-1">
        <h2
          className={`text-xs sm:text-sm font-black uppercase tracking-tight flex items-center gap-1.5 ${
            isNightMode ? 'text-slate-200' : 'text-slate-900'
          }`}
        >
          <CloudSun className="w-4 h-4 text-[#F37021]" />
          Conditions Météorologiques & Thermiques
        </h2>
        <span
          className={`text-[11px] font-extrabold px-2.5 py-1 rounded-md border shadow-sm ${
            isNightMode
              ? 'bg-[#17233D] text-sky-300 border-[#25365A]'
              : 'bg-white text-[#002D72] border-slate-300'
          }`}
        >
          {conditionLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {/* Temp Eau */}
        <div className={`${cardBg} rounded-xl border p-3.5 flex flex-col justify-between`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-black uppercase tracking-wider ${labelColor}`}>
              Température Eau
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isNightMode
                  ? 'bg-sky-950 text-sky-300 border border-sky-800/40'
                  : 'bg-blue-100 text-[#002D72]'
              }`}
            >
              Inertie 7j
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-2">
            <span
              className={`text-3xl font-black font-mono tabular-nums ${
                isNightMode ? 'text-sky-400' : 'text-[#002D72]'
              }`}
            >
              {estimatedWaterTemp !== null ? estimatedWaterTemp.toFixed(1) : '--.-'}
            </span>
            <span className={`text-sm font-bold ${unitColor}`}>°C</span>
          </div>
          <div className={`text-[10px] font-semibold ${isNightMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Modèle inertiel sol/air
          </div>
        </div>

        {/* Temp Air */}
        <div className={`${cardBg} rounded-xl border p-3.5 flex flex-col justify-between`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-black uppercase tracking-wider ${labelColor}`}>
              Température Air
            </span>
            <span
              className={`text-[10px] font-mono font-bold ${
                isNightMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              AROME
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-2">
            <span className={`text-3xl font-black font-mono tabular-nums ${primaryNumberColor}`}>
              {airTemp !== null ? airTemp.toFixed(1) : '--.-'}
            </span>
            <span className={`text-sm font-bold ${unitColor}`}>°C</span>
          </div>
          <div className={`text-[10px] font-bold ${isNightMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Ressenti : <strong className="text-[#F37021] font-mono">{apparentTemp !== null ? `${apparentTemp.toFixed(1)}°C` : '--'}</strong>
          </div>
        </div>

        {/* Vent & Rafales */}
        <div className={`${cardBg} col-span-2 rounded-xl border p-3.5`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-[#F37021]" />
              <span className={`text-[11px] font-black uppercase tracking-wider ${labelColor}`}>
                Vent & Rafales
              </span>
              <span className="opacity-40">·</span>
              <span
                className={`text-[11px] font-bold ${
                  isNightMode ? 'text-slate-300' : 'text-slate-800'
                }`}
              >
                Force {beaufort.force} ({beaufort.description})
              </span>
            </div>

            {/* Compass badge */}
            <div
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs font-mono font-extrabold ${
                isNightMode
                  ? 'bg-[#0E1626] text-sky-300 border-[#25365A]'
                  : 'bg-slate-100 text-[#002D72] border-slate-300'
              }`}
            >
              <div
                style={{
                  transform: `rotate(${windDirDeg !== null ? windDirDeg : 0}deg)`,
                  transition: 'transform 0.5s ease',
                }}
                className="w-3.5 h-3.5 flex items-center justify-center shrink-0"
              >
                <Compass className="w-3.5 h-3.5 text-[#F37021]" />
              </div>
              <span>{windDirCardinal} ({windDirDeg ?? '--'}°)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            {/* Vent moyen */}
            <div className="flex items-baseline gap-1.5">
              <span className={`text-3xl font-black font-mono tabular-nums ${primaryNumberColor}`}>
                {windSpeedKmh !== null ? Math.round(windSpeedKmh) : '--'}
              </span>
              <span className={`text-xs font-bold uppercase ${unitColor}`}>km/h moyen</span>
            </div>

            {/* Rafales */}
            <div className="text-right">
              <div className={`text-[10px] uppercase font-black mb-0.5 ${labelColor}`}>
                Rafales Maximum
              </div>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-2xl font-black font-mono tabular-nums text-[#F37021]">
                  {windGustsKmh !== null ? Math.round(windGustsKmh) : '--'}
                </span>
                <span className={`text-xs font-bold uppercase ${unitColor}`}>km/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pluie & Précipitations */}
        <div className={`${cardBg} rounded-xl border p-3.5`}>
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-1">
            <span className={labelColor}>Précipitations</span>
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className={`text-2xl font-black font-mono tabular-nums ${primaryNumberColor}`}>
              {precipNow.toFixed(1)}
            </span>
            <span className={`text-xs font-bold ${unitColor}`}>mm/h</span>
          </div>
          <div className={`text-[10px] font-bold mt-1 ${isNightMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Cumul +3h : <strong className="text-sky-500 font-mono">{precip3h.toFixed(1)} mm</strong>
          </div>
        </div>

        {/* Éphéméride & Ensoleillement */}
        <div className={`${cardBg} rounded-xl border p-3.5`}>
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-1">
            <span className={labelColor}>Lumière / Éphéméride</span>
            <Sun className="w-3.5 h-3.5 text-[#F37021]" />
          </div>
          <div className="space-y-1 mt-1 text-xs font-mono font-bold">
            <div className="flex items-center justify-between">
              <span className={`flex items-center gap-1 text-[11px] ${labelColor}`}>
                <Sunrise className="w-3 h-3 text-amber-500" /> Lever :
              </span>
              <strong className={primaryNumberColor}>{sunrise || '07:30'}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className={`flex items-center gap-1 text-[11px] ${labelColor}`}>
                <Sunset className="w-3 h-3 text-orange-600" /> Coucher :
              </span>
              <strong className={primaryNumberColor}>{sunset || '19:15'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
