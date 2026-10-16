import React from 'react';

interface NautiqueLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

/**
 * Official Protection Civile Nautique Logo
 * Vector-faithful reproduction of the official nautical insignia:
 * Orange circular badge, white curved triangle border, dark blue triangle, and white fouled anchor.
 */
export const NautiqueLogo: React.FC<NautiqueLogoProps> = ({
  className = '',
  size = 48,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm select-none"
        aria-label="Insigne officiel Protection Civile Nautique"
      >
        {/* Disque extérieur Orange Protection Civile */}
        <circle cx="50" cy="50" r="49" fill="#F37021" />

        {/* Triangle blanc incurvé (Bouclier Nautique) */}
        <path
          d="M 50 4 
             C 52 4, 54 8, 56 12 
             L 88 74 
             C 90 78, 88 83, 84 83 
             L 16 83 
             C 12 83, 10 78, 12 74 
             L 44 12 
             C 46 8, 48 4, 50 4 Z"
          fill="#FFFFFF"
        />

        {/* Triangle central Bleu Nuit Protection Civile */}
        <path
          d="M 50 18
             L 77.5 73.5
             L 22.5 73.5
             Z"
          fill="#002D72"
        />

        {/* Ancre Marine Blanche avec Câblot (Fouled Anchor) */}
        {/* Anneau / Manille supérieure */}
        <circle cx="50" cy="32.5" r="3.6" stroke="#FFFFFF" strokeWidth="1.9" fill="none" />
        <circle cx="50" cy="32.5" r="1.6" fill="#002D72" />

        {/* Jas (barre transversale horizontale sous l'anneau) */}
        <rect x="38.5" y="37.5" width="23" height="2.8" rx="1.2" fill="#FFFFFF" />

        {/* Verge centrale verticale (Shank) */}
        <rect x="48.4" y="36.5" width="3.2" height="27" rx="0.8" fill="#FFFFFF" />

        {/* Câblot d'ancre (ligne enroulée autour de la verge) */}
        <path
          d="M 47.5 33.5
             C 43.5 36, 43.5 41, 49 43
             C 56 45, 57 51, 51 55
             C 45 59, 44 63, 49 67"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Bras de l'ancre et Diamant (Crown) */}
        <path
          d="M 37.5 53
             C 36 62, 42 67, 50 67
             C 58 67, 64 62, 62.5 53"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.4"
          strokeLinecap="round"
        />

        {/* Patte / Bec gauche (Fluke) */}
        <polygon points="36,50 41,56.5 33.5,56.5" fill="#FFFFFF" />

        {/* Patte / Bec droite (Fluke) */}
        <polygon points="64,50 66.5,56.5 59,56.5" fill="#FFFFFF" />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="text-xs font-black tracking-wider uppercase text-pc-orange">
            Protection Civile
          </span>
          <span className="text-sm font-bold text-slate-900 leading-tight">
            Section Nautique • BPI
          </span>
        </div>
      )}
    </div>
  );
};
