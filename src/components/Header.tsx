import React from 'react';
import { NautiqueLogo } from './NautiqueLogo';
import { RotateCw, ClipboardCopy, Moon, Sun } from 'lucide-react';
import { SectorMode } from '../types';

interface HeaderProps {
  sector: SectorMode;
  lastSyncTime: string | null;
  relativeSyncTime: string | null;
  isLoading: boolean;
  isNightMode: boolean;
  onToggleNightMode: () => void;
  onRefresh: () => void;
  onOpenBriefing: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sector,
  lastSyncTime,
  relativeSyncTime,
  isLoading,
  isNightMode,
  onToggleNightMode,
  onRefresh,
  onOpenBriefing,
}) => {
  const sectorLabel =
    sector === 'seine'
      ? 'Seine (Arsenal / Austerlitz PK 167.5)'
      : 'Marne (Créteil / Gournay PK 152)';

  return (
    <header
      className={`sticky top-0 z-40 text-white shadow-md border-b transition-colors ${
        isNightMode
          ? 'bg-[#060D1A] border-[#182338]'
          : 'bg-[#002D72] border-blue-900/60'
      }`}
    >
      {/* Tactical Stripe */}
      <div className="pc-tactical-stripe w-full" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2.5">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <NautiqueLogo size={38} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                Protection Civile Nautique
              </span>
              <span className="text-blue-300/60 text-xs hidden sm:inline">·</span>
              <span className="text-[10px] text-blue-200 font-bold hidden sm:inline">
                BPI
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-tight truncate">
              Préparation Pilote & Nageur
            </h1>
            <div className="text-[10px] sm:text-[11px] text-blue-100/90 truncate flex items-center gap-1.5 mt-0.5 font-medium">
              <span className="text-white font-bold">{sectorLabel}</span>
              {lastSyncTime && (
                <>
                  <span className="text-blue-300/80">·</span>
                  <span className="font-mono tabular-nums">
                    Vigicrues {lastSyncTime} {relativeSyncTime ? `(${relativeSyncTime})` : ''}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mode Nuit / Mode Jour Toggle */}
          <button
            type="button"
            onClick={onToggleNightMode}
            aria-label={isNightMode ? 'Activer le mode plein jour' : 'Activer le mode nuit nautique'}
            className={`min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition active:scale-95 ${
              isNightMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
                : 'bg-white/10 text-blue-100 border-white/20 hover:bg-white/20'
            }`}
          >
            {isNightMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Jour</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-200 shrink-0" />
                <span className="hidden sm:inline">Nuit</span>
              </>
            )}
          </button>

          {/* Desktop Copier Point Nav */}
          <button
            type="button"
            onClick={onOpenBriefing}
            aria-label="Afficher et copier le point de navigation opérationnel"
            className="hidden sm:flex min-h-[40px] px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition items-center gap-2 text-xs font-bold text-white border border-white/15"
          >
            <ClipboardCopy className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Copier Point Nav</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            aria-label="Actualiser les capteurs Vigicrues et la météo"
            className="min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#F37021] hover:bg-[#D85C12] active:scale-95 transition flex items-center gap-1.5 text-xs font-extrabold text-white shadow-md disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
        </div>
      </div>
    </header>
  );
};
