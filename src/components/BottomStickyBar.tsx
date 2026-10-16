import React from 'react';
import { ClipboardCopy, RotateCw, Moon, Sun } from 'lucide-react';

interface BottomStickyBarProps {
  onOpenBriefing: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isNightMode?: boolean;
  onToggleNightMode?: () => void;
}

export const BottomStickyBar: React.FC<BottomStickyBarProps> = ({
  onOpenBriefing,
  onRefresh,
  isLoading,
  isNightMode = false,
  onToggleNightMode,
}) => {
  return (
    <div
      className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t px-3 py-2 shadow-xl pb-safe transition-colors ${
        isNightMode
          ? 'bg-[#060D1A]/95 border-[#182338]'
          : 'bg-white/95 border-slate-300'
      }`}
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <button
          type="button"
          onClick={onOpenBriefing}
          className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-[#002D72] active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition border border-blue-900"
        >
          <ClipboardCopy className="w-4 h-4 text-[#F37021]" />
          <span>Copier Point Nav</span>
        </button>

        {onToggleNightMode && (
          <button
            type="button"
            onClick={onToggleNightMode}
            aria-label={isNightMode ? 'Mode Jour' : 'Mode Nuit'}
            className={`min-h-[46px] min-w-[46px] rounded-xl border flex items-center justify-center shadow-sm active:scale-95 transition ${
              isNightMode
                ? 'bg-[#121A2D] text-amber-400 border-[#25365A]'
                : 'bg-slate-100 text-slate-800 border-slate-300'
            }`}
          >
            {isNightMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#002D72]" />}
          </button>
        )}

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Actualiser les données"
          className="min-h-[46px] min-w-[46px] rounded-xl bg-[#F37021] hover:bg-[#D85C12] active:scale-95 text-white flex items-center justify-center shadow-sm disabled:opacity-50 transition"
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};
