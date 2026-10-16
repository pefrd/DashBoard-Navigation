import React from 'react';
import { NautiqueLogo } from './NautiqueLogo';
import { RotateCw, ClipboardCopy } from 'lucide-react';
import { SectorMode } from '../types';

interface HeaderProps {
  sector: SectorMode;
  lastSyncTime: string | null;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenBriefing: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sector,
  lastSyncTime,
  isLoading,
  onRefresh,
  onOpenBriefing,
}) => {
  const sectorLabel =
    sector === 'seine'
      ? 'Seine (Arsenal / Austerlitz PK 167.5)'
      : sector === 'marne'
      ? 'Marne (Créteil / Gournay)'
      : 'Vision Globale (Seine + Marne)';

  return (
    <header className="sticky top-0 z-40 bg-[#002D72] text-white shadow-md border-b border-blue-900/60">
      {/* Tactical Stripe */}
      <div className="pc-tactical-stripe w-full" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <NautiqueLogo size={40} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                Protection Civile Nautique
              </span>
              <span className="text-blue-300/60 text-xs hidden sm:inline">·</span>
              <span className="text-[10px] text-blue-200 font-medium hidden sm:inline">
                BPI
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-tight truncate">
              Préparation Pilote & Nageur
            </h1>
            <div className="text-[10px] sm:text-[11px] text-blue-200/90 truncate flex items-center gap-1.5 mt-0.5">
              <span className="font-medium text-white/90">{sectorLabel}</span>
              {lastSyncTime && (
                <>
                  <span className="text-blue-300/80">·</span>
                  <span className="text-blue-200 font-mono tabular-nums">{lastSyncTime}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls for Tablet/Desktop (>= 640px) */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenBriefing}
            aria-label="Afficher et copier le point de navigation opérationnel"
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition flex items-center gap-2 text-xs font-semibold text-white border border-white/15"
          >
            <ClipboardCopy className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Copier Point Nav</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            aria-label="Actualiser les capteurs Vigicrues et la météo"
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#F37021] hover:bg-[#D85C12] active:scale-95 transition flex items-center gap-1.5 text-xs font-bold text-white shadow-md disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>

        {/* Compact Mobile Refresh Button (< 640px) */}
        <div className="sm:hidden shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            aria-label="Actualiser les données"
            className="min-h-[40px] min-w-[40px] p-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition flex items-center justify-center text-white border border-white/15 disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 text-orange-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
