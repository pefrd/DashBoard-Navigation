import React from 'react';
import { ClipboardCopy, RotateCw } from 'lucide-react';

interface BottomStickyBarProps {
  onOpenBriefing: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const BottomStickyBar: React.FC<BottomStickyBarProps> = ({
  onOpenBriefing,
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-lg pb-safe">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <button
          type="button"
          onClick={onOpenBriefing}
          className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-[#002D72] active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition"
        >
          <ClipboardCopy className="w-4 h-4 text-[#F37021]" />
          <span>Copier Point Nav</span>
        </button>

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
