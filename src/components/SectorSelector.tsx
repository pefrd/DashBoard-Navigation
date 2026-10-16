import React from 'react';
import { Waves, Layers } from 'lucide-react';
import { SectorMode } from '../types';

interface SectorSelectorProps {
  activeSector: SectorMode;
  onSelectSector: (sector: SectorMode) => void;
}

export const SectorSelector: React.FC<SectorSelectorProps> = ({
  activeSector,
  onSelectSector,
}) => {
  const tabs: { id: SectorMode; label: string; sub: string; icon: React.ReactNode }[] = [
    {
      id: 'seine',
      label: 'Seine',
      sub: 'Arsenal / Austerlitz',
      icon: <Waves className="w-3.5 h-3.5" />,
    },
    {
      id: 'marne',
      label: 'Marne',
      sub: 'Créteil / Gournay',
      icon: <Waves className="w-3.5 h-3.5" />,
    },
    {
      id: 'combined',
      label: 'Global',
      sub: 'Seine + Marne',
      icon: <Layers className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Sélection du secteur d'intervention"
      className="bg-slate-200/80 p-1 rounded-xl flex gap-1 shadow-inner border border-slate-200 w-full"
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
            className={`flex-1 min-h-[44px] py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all active:scale-[0.98] ${
              isActive
                ? 'bg-white text-[#002D72] shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span className="flex items-center gap-1.5 leading-none">
              <span className={isActive ? 'text-[#F37021]' : 'opacity-60'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </span>
            <span
              className={`text-[9px] font-normal mt-0.5 truncate max-w-full ${
                isActive ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {tab.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
};
