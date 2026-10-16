import React from 'react';
import { Waves } from 'lucide-react';
import { SectorMode } from '../types';

interface SectorSelectorProps {
  activeSector: SectorMode;
  onSelectSector: (sector: SectorMode) => void;
  isNightMode?: boolean;
}

export const SectorSelector: React.FC<SectorSelectorProps> = ({
  activeSector,
  onSelectSector,
  isNightMode = false,
}) => {
  const tabs: { id: SectorMode; label: string }[] = [
    { id: 'seine', label: 'Seine' },
    { id: 'marne', label: 'Marne' },
  ];

  return (
    <div
      role="tablist"
      aria-label="Sélection du secteur d'intervention"
      className={`p-1 rounded-xl flex gap-1 shadow-inner border w-full transition-colors ${
        isNightMode
          ? 'bg-[#121A2D] border-[#1E2942]'
          : 'bg-slate-200/90 border-slate-300'
      }`}
    >
      {tabs.map((tab) => {
        const isActive = activeSector === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onSelectSector(tab.id)}
            className={`flex-1 min-h-[42px] py-2 px-3 rounded-lg text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              isActive
                ? isNightMode
                  ? 'bg-[#1D2A47] text-white shadow-sm ring-1 ring-white/10'
                  : 'bg-white text-[#002D72] shadow-sm ring-1 ring-black/5'
                : isNightMode
                ? 'text-slate-400 hover:text-white hover:bg-white/5'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <Waves className={`w-3.5 h-3.5 ${isActive ? 'text-[#F37021]' : 'opacity-60'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
