import React from 'react';
import { CloudSun, Droplets, Wind, Sun, Sunrise, Sunset, Compass } from 'lucide-react';
import { WeatherData } from '../types';
import { getBeaufortScale, decodeWMOWeatherCode } from '../utils/hydroLogic';

interface WeatherGridProps {
  weather: WeatherData;
}

export const WeatherGrid: React.FC<WeatherGridProps> = ({ weather }) => {
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

  return (
    <div className="space-y-3">
      {/* Header with Condition */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-800 flex items-center gap-1.5">
          <CloudSun className="w-4 h-4 text-[#F37021]" />
          Conditions Météorologiques & Thermiques
        </h2>
        <span className="text-[11px] font-semibold text-[#002D72] bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
          {conditionLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {/* Temp Eau (Critical for Swimmer) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/90 p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Température Eau
            </span>
            <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
              Inertie 7j
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-2">
            <span className="text-3xl font-black text-[#002D72] font-mono tabular-nums">
              {estimatedWaterTemp !== null ? estimatedWaterTemp.toFixed(1) : '--.-'}
            </span>
            <span className="text-sm font-bold text-slate-400">°C</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Modèle inertiel sol/air 7j
          </div>
        </div>

        {/* Temp Air */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/90 p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Température Air
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              AROME
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-2">
            <span className="text-3xl font-black text-slate-800 font-mono tabular-nums">
              {airTemp !== null ? airTemp.toFixed(1) : '--.-'}
            </span>
            <span className="text-sm font-bold text-slate-400">°C</span>
          </div>
          <div className="text-[10px] text-slate-600 font-medium">
            Ressenti : <strong className="text-[#F37021] font-mono">{apparentTemp !== null ? `${apparentTemp.toFixed(1)}°C` : '--'}</strong>
          </div>
        </div>

        {/* Vent & Rafales (Full Width Strip for Tactical Wind Awareness) */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200/90 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-[#002D72]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Vent & Rafales
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-[11px] font-semibold text-slate-700">
                Force {beaufort.force} ({beaufort.description})
              </span>
            </div>

            {/* Compass badge */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-xs font-mono font-bold text-[#002D72]">
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
              <span className="text-3xl font-black text-slate-900 font-mono tabular-nums">
                {windSpeedKmh !== null ? Math.round(windSpeedKmh) : '--'}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase">km/h moyen</span>
            </div>

            {/* Rafales */}
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                Rafales Maximum
              </div>
              <div className="flex items-baseline justify-end gap-1">
                <span className={`text-2xl font-black font-mono tabular-nums ${windGustsKmh && windGustsKmh >= 40 ? 'text-rose-600' : 'text-[#F37021]'}`}>
                  {windGustsKmh !== null ? Math.round(windGustsKmh) : '--'}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase">km/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pluie & Précipitations */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/90 p-3">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            <span>Précipitations</span>
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              {precipNow.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-500">mm/h</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Cumul +3h : <strong className="text-[#002D72] font-mono">{precip3h.toFixed(1)} mm</strong>
          </div>
        </div>

        {/* Éphéméride & Ensoleillement */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/90 p-3">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            <span>Lumière / Éphéméride</span>
            <Sun className="w-3.5 h-3.5 text-[#F37021]" />
          </div>
          <div className="space-y-1 mt-1 text-xs font-mono text-slate-700">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <Sunrise className="w-3 h-3 text-amber-500" /> Lever :
              </span>
              <strong className="text-slate-900">{sunrise || '07:30'}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <Sunset className="w-3 h-3 text-orange-600" /> Coucher :
              </span>
              <strong className="text-slate-900">{sunset || '19:15'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
