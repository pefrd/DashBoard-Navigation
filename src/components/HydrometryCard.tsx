import React from 'react';
import { Gauge, ArrowUpRight, ArrowDownRight, Minus, Satellite } from 'lucide-react';
import { RiverStationData } from '../types';

interface HydrometryCardProps {
  station: RiverStationData;
  isPrimary?: boolean;
}

export const HydrometryCard: React.FC<HydrometryCardProps> = ({
  station,
  isPrimary = true,
}) => {
  const { currentVelocityKmh, currentVelocityMs, flowM3s, flowTrend, heightM, heightTrendCm, obsTime } = station;

  const formattedTime = obsTime
    ? new Date(obsTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden flex flex-col justify-between">
      {/* Station Header */}
      <div className={`${isPrimary ? 'bg-[#002D72]' : 'bg-slate-800'} text-white px-4 py-3 flex items-center justify-between`}>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-white truncate">
            {station.name}
          </h3>
          <p className="text-[11px] text-blue-200/80 truncate">
            {station.location}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono text-blue-100 bg-white/10 px-2.5 py-1 rounded-md">
            Relevé {formattedTime}
          </span>
        </div>
      </div>

      {/* Main Hydrometry Metrics */}
      <div className="p-3.5 sm:p-4 space-y-3">
        {/* Vitesse du courant */}
        <div className="bg-blue-50/70 rounded-xl p-3.5 border border-blue-100/90 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#002D72] flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#F37021]" />
              Vitesse du Courant
            </div>
            <div className="text-xs font-mono font-medium text-[#002D72]/80 mt-1">
              <span className="tabular-nums font-bold">{currentVelocityMs.toFixed(2)} m/s</span>
            </div>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-black text-[#002D72] tabular-nums font-mono">
              {currentVelocityKmh.toFixed(1)}
            </span>
            <span className="text-xs font-bold uppercase text-[#002D72]/70">km/h</span>
          </div>
        </div>

        {/* 2-Column Grid: Flow & Water Level */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Débit Q */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Débit Fluvial (Q)
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 tabular-nums font-mono">
                {flowM3s !== null ? Math.round(flowM3s) : '--'}
              </span>
              <span className="text-xs font-semibold text-slate-500">m³/s</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-600 font-medium truncate">
              {flowTrend.includes('Hausse') ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              ) : flowTrend.includes('Baisse') ? (
                <ArrowDownRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              ) : (
                <Minus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <span className="truncate">{flowTrend}</span>
            </div>
          </div>

          {/* Hauteur H */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Hauteur d'Eau (H)
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 tabular-nums font-mono">
                {heightM !== null ? heightM.toFixed(2) : '--'}
              </span>
              <span className="text-xs font-semibold text-slate-500">m</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-600 font-medium font-mono tabular-nums">
              <span>Var. 6h :</span>
              <strong className="text-slate-800">
                {heightTrendCm !== null ? `${heightTrendCm > 0 ? '+' : ''}${heightTrendCm} cm` : '--'}
              </strong>
            </div>
          </div>
        </div>

        {/* Sensor Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Satellite className="w-3 h-3 text-[#002D72]" />
            Capteur télémesure Vigicrues
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            PK {isPrimary ? '167.5' : '152.0'}
          </span>
        </div>
      </div>
    </div>
  );
};
