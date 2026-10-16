import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react';
import { WeatherData, RiverStationData, SectorMode } from '../types';

interface BriefingShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  sector: SectorMode;
  seine: RiverStationData;
  marne: RiverStationData;
  weather: WeatherData;
  onShowToast: (msg: string) => void;
}

export const BriefingShareModal: React.FC<BriefingShareModalProps> = ({
  isOpen,
  onClose,
  sector,
  seine,
  marne,
  weather,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const nowStr = new Date().toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const waterTempStr =
    weather.estimatedWaterTemp !== null
      ? `${weather.estimatedWaterTemp.toFixed(1)}°C`
      : '--°C';

  const airTempStr =
    weather.airTemp !== null ? `${weather.airTemp.toFixed(1)}°C` : '--°C';

  const windStr =
    weather.windSpeedKmh !== null
      ? `${Math.round(weather.windSpeedKmh)} km/h (${weather.windDirCardinal}) · Rafales ${
          weather.windGustsKmh !== null ? Math.round(weather.windGustsKmh) : '--'
        } km/h`
      : '--';

  const lines: string[] = [
    `🚤 *POINT NAVIGATION NAUTIQUE PC*`,
    `📍 Secteur : ${
      sector === 'seine'
        ? 'Seine (Arsenal / Austerlitz PK 167.5)'
        : sector === 'marne'
        ? 'Marne (Créteil / Gournay PK 152)'
        : 'Bassin Seine & Marne'
    }`,
    `🕒 ${nowStr}`,
    ``,
    `🌡️ *MÉTÉO & TEMPÉRATURES*`,
    `• Eau : ${waterTempStr}`,
    `• Air : ${airTempStr} (Ressenti ${
      weather.apparentTemp !== null ? `${weather.apparentTemp.toFixed(1)}°C` : '--'
    })`,
    `• Vent : ${windStr}`,
    `• Pluie : ${weather.precipNow.toFixed(1)} mm/h (Cumul +3h : ${weather.precip3h.toFixed(1)} mm)`,
    ``,
    `🌊 *HYDROMÉTRIE VIGICRUES*`,
  ];

  if (sector === 'seine' || sector === 'combined') {
    lines.push(
      `• SEINE (Austerlitz) :`,
      `  - Vitesse courant : ${seine.currentVelocityKmh.toFixed(1)} km/h (${seine.currentVelocityMs.toFixed(2)} m/s)`,
      `  - Débit : ${seine.flowM3s !== null ? Math.round(seine.flowM3s) : '--'} m³/s (${seine.flowTrend})`,
      `  - Hauteur d'eau : ${seine.heightM !== null ? seine.heightM.toFixed(2) : '--'} m`
    );
  }

  if (sector === 'marne' || sector === 'combined') {
    lines.push(
      `• MARNE (Créteil) :`,
      `  - Vitesse courant : ${marne.currentVelocityKmh.toFixed(1)} km/h (${marne.currentVelocityMs.toFixed(2)} m/s)`,
      `  - Débit : ${marne.flowM3s !== null ? Math.round(marne.flowM3s) : '--'} m³/s (${marne.flowTrend})`,
      `  - Hauteur d'eau : ${marne.heightM !== null ? marne.heightM.toFixed(2) : '--'} m`
    );
  }

  const fullBriefingText = lines.join('\n');

  const handleCopy = async () => {
    let success = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullBriefingText);
        success = true;
      }
    } catch (e) {
      // ignore
    }

    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = fullBriefingText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (err2) {
        success = false;
      }
    }

    setCopied(true);
    onShowToast('Point Nav copié dans le presse-papier !');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Point Nav Nautique PC',
          text: fullBriefingText,
        });
        onShowToast('Point Nav partagé avec succès.');
      } catch (e) {
        // user aborted
      }
    } else {
      handleCopy();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    fullBriefingText
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="briefing-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
    >
      <div className="bg-white w-full sm:max-w-xl max-h-[92vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 bg-[#002D72] text-white flex items-center justify-between">
          <div>
            <h2 id="briefing-title" className="text-sm sm:text-base font-bold">
              Point Nav Opérationnel BPI
            </h2>
            <p className="text-[11px] text-blue-200">
              Synthèse factuelle de mission (WhatsApp / Radio)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le point nav"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Area Content */}
        <div className="p-4 overflow-y-auto max-h-[55vh]">
          <pre className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed select-all">
            {fullBriefingText}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#D85C12] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copié !' : 'Copier le Point Nav'}</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition shadow-sm text-center"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Partager WhatsApp</span>
          </a>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              aria-label="Partager le briefing"
              className="min-h-[44px] px-3 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <Share2 className="w-4 h-4" />
              <span className="sm:inline">Partager</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
