import React from 'react';
import { Gauge, ArrowUpRight, ArrowDownRight, Minus, Satellite, Clock } from 'lucide-react';
import { RiverStationData } from '../types';
import { formatRelativeTime } from '../utils/hydroLogic';

interface HydrometryCardProps {
  station: RiverStationData;
  isPrimary?: boolean;
  isNightMode?: boolean;
}

export const HydrometryCard: React.FC<HydrometryCardProps> = ({
  station,
  isPrimary = true,
  isNightMode = false,
}) => {
  const { currentVelocityKmh, currentVelocityMs, flowM3s, flowTrend, heightM, heightTrendCm, obsTime } = station;

  const formattedTime = obsTime
    ? new Date(obsTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  const relativeTime = formatRelativeTime(obsTime);

  // Check if sensor reading is delayed (> 45 min)
  const isDelayed = obsTime ? (Date.now() - new Date(obsTime).getTime()) > 45 * 60000 : false;

  return (
    <div
      className={`rounded-2xl shadow-sm border overflow-hidden flex flex-col justify-between transition-colors ${
        isNightMode
          ? 'bg-[#121A2D] border-[#1E2942]'
          : 'bg-white border-slate-300'
      }`}
    >
      {/* Station Header */}
      <div
        className={`${
          isPrimary
            ? isNightMode ? 'bg-[#001E4D]' : 'bg-[#002D72]'
            : isNightMode ? 'bg-slate-900' : 'bg-slate-800'
        } text-white px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2`}
      >
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-tight">
            {station.name}
          </h3>
          <p className="text-[11px] text-blue-100 font-medium truncate mt-0.5">
            {station.location}
          </p>
        </div>

        {/* Indicateur de fraîcheur de la donnée */}
        <div className="self-start sm:self-auto shrink-0">
          <div
            className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border font-semibold ${
              isDelayed
                ? 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                : isNightMode
                ? 'bg-blue-950/80 text-blue-200 border-blue-800/60'
                : 'bg-white/15 text-white border-white/20'
            }`}
          >
            <Clock className="w-3 h-3 text-orange-400 shrink-0" />
            <span>Relevé {formattedTime}</span>
            {relativeTime && (
              <>
                <span className="opacity-60">·</span>
                <span className="font-bold">{relativeTime}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Hydrometry Metrics */}
      <div className="p-3.5 sm:p-4 space-y-3">
        {/* Vitesse du courant (Plein soleil & Mode nuit haute visibilité) */}
        <div
          className={`rounded-xl p-3.5 border flex items-center justify-between transition-colors ${
            isNightMode
              ? 'bg-[#17233D] border-[#25365A] text-white'
              : 'bg-blue-50/90 border-blue-200 text-[#002D72]'
          }`}
        >
          <div>
            <div
              className={`text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                isNightMode ? 'text-sky-400' : 'text-[#002D72]'
              }`}
            >
              <Gauge className="w-4 h-4 text-[#F37021]" />
              Vitesse du Courant
            </div>
            <div
              className={`text-xs font-mono font-bold mt-1 ${
                isNightMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <span className="tabular-nums font-bold">{currentVelocityMs.toFixed(2)} m/s</span>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-3xl sm:text-4xl font-black tabular-nums font-mono ${
                isNightMode ? 'text-white' : 'text-[#002D72]'
              }`}
            >
              {currentVelocityKmh.toFixed(1)}
            </span>
            <span
              className={`text-xs font-black uppercase ${
                isNightMode ? 'text-sky-300' : 'text-slate-700'
              }`}
            >
              km/h
            </span>
          </div>
        </div>

        {/* 2-Column Grid: Flow & Water Level */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Débit Q */}
          <div
            className={`rounded-xl p-3 border transition-colors ${
              isNightMode
                ? 'bg-[#0E1626] border-[#1E2942]'
                : 'bg-slate-100/90 border-slate-300'
            }`}
          >
            <div
              className={`text-[10px] font-black uppercase tracking-wider mb-1 ${
                isNightMode ? 'text-slate-400' : 'text-slate-700'
              }`}
            >
              Débit Fluvial (Q)
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl font-black tabular-nums font-mono ${
                  isNightMode ? 'text-white' : 'text-slate-950'
                }`}
              >
                {flowM3s !== null ? Math.round(flowM3s) : '--'}
              </span>
              <span
                className={`text-xs font-bold ${
                  isNightMode ? 'text-slate-400' : 'text-slate-700'
                }`}
              >
                m³/s
              </span>
            </div>
            <div
              className={`mt-1.5 flex items-center gap-1 text-[11px] font-bold truncate ${
                isNightMode ? 'text-slate-300' : 'text-slate-800'
              }`}
            >
              {flowTrend.includes('Hausse') ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              ) : flowTrend.includes('Baisse') ? (
                <ArrowDownRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              ) : (
                <Minus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <span className="truncate">{flowTrend}</span>
            </div>
          </div>

          {/* Hauteur H */}
          <div
            className={`rounded-xl p-3 border transition-colors ${
              isNightMode
                ? 'bg-[#0E1626] border-[#1E2942]'
                : 'bg-slate-100/90 border-slate-300'
            }`}
          >
            <div
              className={`text-[10px] font-black uppercase tracking-wider mb-1 ${
                isNightMode ? 'text-slate-400' : 'text-slate-700'
              }`}
            >
              Hauteur d'Eau (H)
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl font-black tabular-nums font-mono ${
                  isNightMode ? 'text-white' : 'text-slate-950'
                }`}
              >
                {heightM !== null ? heightM.toFixed(2) : '--'}
              </span>
              <span
                className={`text-xs font-bold ${
                  isNightMode ? 'text-slate-400' : 'text-slate-700'
                }`}
              >
                m
              </span>
            </div>
            <div
              className={`mt-1.5 flex items-center gap-1 text-[11px] font-bold font-mono tabular-nums ${
                isNightMode ? 'text-slate-300' : 'text-slate-800'
              }`}
            >
              <span>Var. 6h :</span>
              <strong className={isNightMode ? 'text-amber-400' : 'text-slate-900'}>
                {heightTrendCm !== null ? `${heightTrendCm > 0 ? '+' : ''}${heightTrendCm} cm` : '--'}
              </strong>
            </div>
          </div>
        </div>

        {/* Sensor Footer */}
        <div
          className={`pt-2 border-t flex items-center justify-between text-[11px] font-medium ${
            isNightMode ? 'border-[#1E2942] text-slate-400' : 'border-slate-200 text-slate-700'
          }`}
        >
          <span className="flex items-center gap-1">
            <Satellite className="w-3.5 h-3.5 text-[#F37021]" />
            Capteur télémesure Vigicrues
          </span>
          <span className="font-mono text-[10px] font-semibold">
            PK {isPrimary ? '167.5' : '152.0'}
          </span>
        </div>
      </div>
    </div>
  );
};
