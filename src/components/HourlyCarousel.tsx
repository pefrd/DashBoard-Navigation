import React from 'react';
import { Clock, Wind, Droplets } from 'lucide-react';
import { HourlyForecast } from '../types';

interface HourlyCarouselProps {
  hourly: HourlyForecast[];
  isNightMode?: boolean;
}

export const HourlyCarousel: React.FC<HourlyCarouselProps> = ({ hourly, isNightMode = false }) => {
  if (!hourly || hourly.length === 0) {
    return (
      <div
        className={`rounded-2xl p-4 text-center text-xs font-semibold ${
          isNightMode ? 'bg-[#121A2D] text-slate-400 border border-[#1E2942]' : 'bg-white text-slate-600 border border-slate-300'
        }`}
      >
        Chargement des prévisions horaires...
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h2
          className={`text-xs sm:text-sm font-black uppercase tracking-tight flex items-center gap-1.5 ${
            isNightMode ? 'text-slate-200' : 'text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-[#F37021]" />
          Évolution Horaire (+6H)
        </h2>
        <span className={`text-[10px] font-mono font-bold ${isNightMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Modèle AROME
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 snap-x scroll-smooth">
        {hourly.map((item, idx) => {
          const isNow = idx === 0;
          return (
            <div
              key={item.time}
              className={`snap-start shrink-0 w-[96px] rounded-xl p-2.5 border flex flex-col items-center justify-between text-center gap-1 shadow-sm transition-all ${
                isNow
                  ? isNightMode
                    ? 'bg-amber-950/40 border-[#F37021] ring-1 ring-[#F37021]/50 text-white'
                    : 'bg-orange-50/80 border-[#F37021] ring-1 ring-[#F37021]/40 text-slate-950'
                  : isNightMode
                  ? 'bg-[#121A2D] border-[#1E2942] text-slate-200'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`text-[11px] font-black font-mono ${
                    isNow ? 'text-[#F37021]' : isNightMode ? 'text-slate-300' : 'text-slate-700'
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

              <div className="text-xl font-black font-mono tabular-nums my-0.5">
                {Math.round(item.temp)}°
              </div>

              <div className={`w-full border-t my-0.5 ${isNightMode ? 'border-[#1E2942]' : 'border-slate-200'}`} />

              {/* Vent & Rafales */}
              <div className="text-[10px] font-bold flex items-center gap-1">
                <Wind className="w-3 h-3 text-[#F37021] shrink-0" />
                <span className="font-mono tabular-nums">{Math.round(item.wind)}</span>
                <span className={`text-[9px] ${isNightMode ? 'text-slate-400' : 'text-slate-600'}`}>km/h</span>
              </div>
              <div className={`text-[9px] font-mono font-bold ${isNightMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Raf. <span className="font-extrabold text-[#F37021]">{Math.round(item.gusts)}</span>
              </div>

              {/* Pluie */}
              <div
                className={`text-[10px] font-bold mt-0.5 flex items-center gap-0.5 ${
                  item.precip > 0 ? 'text-sky-500' : isNightMode ? 'text-slate-500' : 'text-slate-600'
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
