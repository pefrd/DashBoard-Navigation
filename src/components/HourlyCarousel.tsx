import React from 'react';
import { Clock, Wind, Droplets } from 'lucide-react';
import { HourlyForecast } from '../types';

interface HourlyCarouselProps {
  hourly: HourlyForecast[];
}

export const HourlyCarousel: React.FC<HourlyCarouselProps> = ({ hourly }) => {
  if (!hourly || hourly.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center text-xs text-slate-400">
        Chargement des prévisions horaires...
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-800 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#F37021]" />
          Évolution Horaire (+6H)
        </h2>
        <span className="text-[10px] text-slate-500 font-mono">
          Modèle Météo AROME
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 snap-x scroll-smooth">
        {hourly.map((item, idx) => {
          const isNow = idx === 0;
          return (
            <div
              key={item.time}
              className={`snap-start shrink-0 w-[95px] rounded-xl p-2.5 border flex flex-col items-center justify-between text-center gap-1 shadow-sm transition-all ${
                isNow
                  ? 'bg-orange-50/40 border-[#F37021] ring-1 ring-[#F37021]/30'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`text-[11px] font-bold font-mono ${
                    isNow ? 'text-[#F37021]' : 'text-slate-600'
                  }`}
                >
                  {item.time}
                </span>
                {isNow && (
                  <span className="text-[8px] uppercase tracking-wider font-extrabold bg-[#F37021] text-white px-1 py-0.2 rounded">
                    Actuel
                  </span>
                )}
              </div>

              <div className="text-xl font-black text-slate-900 font-mono tabular-nums my-0.5">
                {Math.round(item.temp)}°
              </div>

              <div className="w-full border-t border-slate-100 my-0.5" />

              {/* Vent & Rafales */}
              <div className="text-[10px] font-medium text-slate-700 flex items-center gap-1">
                <Wind className="w-3 h-3 text-[#002D72] shrink-0" />
                <span className="font-mono tabular-nums font-bold">
                  {Math.round(item.wind)}
                </span>
                <span className="text-[9px] text-slate-400">km/h</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                Raf. <span className="font-semibold text-[#F37021]">{Math.round(item.gusts)}</span>
              </div>

              {/* Pluie */}
              <div
                className={`text-[10px] font-medium mt-0.5 flex items-center gap-0.5 ${
                  item.precip > 0 ? 'text-blue-600 font-bold' : 'text-slate-400'
                }`}
              >
                <Droplets className="w-2.5 h-2.5 shrink-0" />
                <span className="font-mono">{item.precip > 0 ? `${item.precip.toFixed(1)}mm` : '0 mm'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
