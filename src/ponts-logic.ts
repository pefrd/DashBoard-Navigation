export interface SectorInfo {
  name: string;
  color: string;
  box: string;
}

export interface BridgeInfo {
  id: number;
  name: string;
  sector: number;
  type: string;
  banks: string;
  year: number;
  key: string;
  clue: string;
  x: number;
  y: number;
  angle?: number; // Orientation angle across the Seine in degrees
}

export interface ViewBoxRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const SECTORS: Record<number, SectorInfo> = {
  1: { name: "Secteur 1 : Est (1-8)", color: "#f97316", box: "670 240 310 290" },
  2: { name: "Secteur 2 : St-Louis (9-13)", color: "#10b981", box: "575 180 140 130" },
  3: { name: "Secteur 3 : Cité (14-21)", color: "#a855f7", box: "475 150 145 145" },
  4: { name: "Secteur 4 : Musées (22-28)", color: "#eab308", box: "235 95 260 115" },
  5: { name: "Secteur 5 : Ouest (29-37)", color: "#ec4899", box: "35 155 240 375" }
};

export const BRIDGES: BridgeInfo[] = [
  { id: 1, name: "Pont amont", sector: 1, type: "Routier (Périph.)", banks: "13e (RG) ↔ 12e (RD)", year: 1969, key: "Amont", clue: "Périphérique Est : entrée de la Seine dans Paris.", x: 935, y: 495, angle: 45 },
  { id: 2, name: "Pont National", sector: 1, type: "Routier & Tram", banks: "13e (RG) ↔ 12e (RD)", year: 1853, key: "Nation", clue: "Boulevard des Maréchaux.", x: 902, y: 465, angle: 45 },
  { id: 3, name: "Pont de Tolbiac", sector: 1, type: "Routier", banks: "13e (BnF) ↔ 12e (Bercy)", year: 1882, key: "Tolbiac", clue: "Face aux 4 tours de la BnF.", x: 868, y: 432, angle: 45 },
  { id: 4, name: "Passerelle Simone-de-Beauvoir", sector: 1, type: "Piéton", banks: "Parvis BnF ↔ Parc de Bercy", year: 2006, key: "Simone", clue: "Passerelle piétonne en lentille centrale.", x: 836, y: 400, angle: 45 },
  { id: 5, name: "Pont de Bercy", sector: 1, type: "Route + Métro 6", banks: "13e ↔ 12e (Bercy)", year: 1864, key: "Boire", clue: "Pont à 2 niveaux portant le Métro 6.", x: 804, y: 368, angle: 45 },
  { id: 6, name: "Pont Charles-de-Gaulle", sector: 1, type: "Routier", banks: "Austerlitz ↔ Gare de Lyon", year: 1996, key: "Charles", clue: "Tablier blanc profilé comme une aile d'avion.", x: 772, y: 336, angle: 45 },
  { id: 7, name: "Viaduc d'Austerlitz", sector: 1, type: "Ferroviaire", banks: "Austerlitz ↔ Quai Rapée", year: 1904, key: "Viaduc", clue: "Arche métallique réservée au Métro 5.", x: 742, y: 308, angle: 45 },
  { id: 8, name: "Pont d'Austerlitz", sector: 1, type: "Routier", banks: "Jardin des Plantes ↔ Bastille", year: 1855, key: "Austerlitz", clue: "Pont routier face au Jardin des Plantes.", x: 712, y: 282, angle: 45 },
  { id: 9, name: "Pont de Sully", sector: 2, type: "Routier", banks: "5e ↔ Île St-Louis ↔ 4e", year: 1876, key: "Sully", clue: "Traverse toute la Seine sur la pointe est de l'Île St-Louis.", x: 675, y: 258, angle: 60 },
  { id: 10, name: "Pont de la Tournelle", sector: 2, type: "Routier", banks: "5e (RG) ↔ Île Saint-Louis", year: 1930, key: "tourne", clue: "Bras sud, statue de Sainte Geneviève.", x: 642, y: 274, angle: 10 },
  { id: 11, name: "Pont Marie", sector: 2, type: "Routier", banks: "Île Saint-Louis ↔ 4e", year: 1635, key: "Marie", clue: "2e plus ancien pont de Paris (1635).", x: 652, y: 222, angle: 10 },
  { id: 12, name: "Pont Louis-Philippe", sector: 2, type: "Routier", banks: "Île Saint-Louis ↔ Marais", year: 1862, key: "Louis-Philippe", clue: "Relie l'île au quartier du Marais.", x: 622, y: 210, angle: 15 },
  { id: 13, name: "Pont Saint-Louis", sector: 2, type: "Piéton", banks: "Île St-Louis ↔ Île de la Cité", year: 1970, key: "Saint-Louis", clue: "Passerelle reliant les deux îles.", x: 608, y: 242, angle: 100 },
  { id: 14, name: "Pont de l'Archevêché", sector: 3, type: "Routier", banks: "5e ↔ Chevet Notre-Dame", year: 1828, key: "Archevêque", clue: "Derrière le chevet de Notre-Dame.", x: 590, y: 266, angle: 20 },
  { id: 15, name: "Pont au Double", sector: 3, type: "Routier", banks: "5e ↔ Flanc Notre-Dame", year: 1883, key: "Double", clue: "Nom du péage médiéval.", x: 568, y: 256, angle: 25 },
  { id: 16, name: "Pont d'Arcole", sector: 3, type: "Routier", banks: "Cité ↔ Hôtel de Ville", year: 1855, key: "Arcole", clue: "Débouche face à l'Hôtel de Ville.", x: 578, y: 198, angle: 20 },
  { id: 17, name: "Petit-Pont-Cardinal-Lustiger", sector: 3, type: "Routier", banks: "Rue St-Jacques ↔ Cité", year: 1853, key: "Petit", clue: "Le plus court de Paris (32 m).", x: 546, y: 246, angle: 25 },
  { id: 18, name: "Pont Notre-Dame", sector: 3, type: "Routier", banks: "Cité ↔ Quai de Gesvres", year: 1914, key: "Notre-Dame", clue: "Prolonge le Petit-Pont.", x: 556, y: 188, angle: 25 },
  { id: 19, name: "Pont Saint-Michel", sector: 3, type: "Routier", banks: "Place St-Michel ↔ Cité", year: 1857, key: "Saint-Michel", clue: "Face à la fontaine Saint-Michel.", x: 524, y: 236, angle: 30 },
  { id: 20, name: "Pont au Change", sector: 3, type: "Routier", banks: "Conciergerie ↔ Châtelet", year: 1860, key: "Changent", clue: "Ancien pont des changeurs.", x: 534, y: 178, angle: 30 },
  { id: 21, name: "Pont Neuf", sector: 3, type: "Routier", banks: "6e ↔ Pointe Cité ↔ 1er", year: 1607, key: "Neuf", clue: "Le plus ancien pont de Paris (1607).", x: 498, y: 195, angle: 25 },
  { id: 22, name: "Pont des Arts", sector: 4, type: "Piéton", banks: "Institut de France ↔ Louvre", year: 1804, key: "Arts", clue: "Passerelle piétonne face au Louvre.", x: 462, y: 175, angle: 15 },
  { id: 23, name: "Pont du Carrousel", sector: 4, type: "Routier", banks: "Quai Voltaire ↔ Louvre", year: 1939, key: "Carrousel", clue: "Face aux guichets du Louvre.", x: 430, y: 160, angle: 10 },
  { id: 24, name: "Pont Royal", sector: 4, type: "Routier", banks: "Orsay ↔ Tuileries", year: 1689, key: "Royal", clue: "Financé par Louis XIV en 1689.", x: 398, y: 146, angle: 5 },
  { id: 25, name: "Passerelle Léopold-Sédar-Senghor", sector: 4, type: "Piéton", banks: "Orsay ↔ Tuileries", year: 1999, key: "Senghor", clue: "Ancienne passerelle de Solférino.", x: 366, y: 135, angle: 0 },
  { id: 26, name: "Pont de la Concorde", sector: 4, type: "Routier", banks: "Assemblée nat. ↔ Concorde", year: 1791, key: "Concorde", clue: "Pierres issues de la Bastille.", x: 332, y: 128, angle: -10 },
  { id: 27, name: "Pont Alexandre-III", sector: 4, type: "Routier", banks: "Invalides ↔ Grand Palais", year: 1900, key: "Alexandre", clue: "4 pylônes à Pégases dorés.", x: 298, y: 138, angle: -25 },
  { id: 28, name: "Pont des Invalides", sector: 4, type: "Routier", banks: "7e ↔ 8e", year: 1856, key: "Invalides", clue: "Le pont le plus bas de Paris.", x: 266, y: 155, angle: -40 },
  { id: 29, name: "Pont de l'Alma", sector: 5, type: "Routier", banks: "7e ↔ 8e/16e", year: 1974, key: "Alma", clue: "Statue du Zouave (crues).", x: 236, y: 182, angle: -50 },
  { id: 30, name: "Passerelle Debilly", sector: 5, type: "Piéton", banks: "Quai Branly ↔ Palais de Tokyo", year: 1900, key: "Debilly", clue: "Passerelle métallique de 1900.", x: 212, y: 214, angle: -55 },
  { id: 31, name: "Pont d'Iéna", sector: 5, type: "Routier", banks: "Tour Eiffel ↔ Trocadéro", year: 1814, key: "Iéna", clue: "Entre Tour Eiffel et Trocadéro.", x: 188, y: 250, angle: -60 },
  { id: 32, name: "Pont de Bir-Hakeim", sector: 5, type: "Route + Métro", banks: "15e ↔ Île aux Cygnes ↔ 16e", year: 1905, key: "Bir-Hakeim", clue: "Viaduc du Métro 6.", x: 166, y: 292, angle: -65 },
  { id: 33, name: "Pont Rouelle", sector: 5, type: "Ferroviaire", banks: "15e ↔ Île aux Cygnes ↔ 16e", year: 1900, key: "Rouelle", clue: "Pont RER C sur l'Île aux Cygnes.", x: 146, y: 334, angle: -70 },
  { id: 34, name: "Pont de Grenelle", sector: 5, type: "Routier", banks: "15e ↔ Île aux Cygnes ↔ 16e", year: 1968, key: "Grenelle", clue: "Statue de la Liberté.", x: 126, y: 376, angle: -70 },
  { id: 35, name: "Pont Mirabeau", sector: 5, type: "Routier", banks: "15e ↔ 16e", year: 1896, key: "Mirabeau", clue: "Poème de Guillaume Apollinaire.", x: 106, y: 418, angle: -70 },
  { id: 36, name: "Pont du Garigliano", sector: 5, type: "Routier", banks: "15e ↔ 16e", year: 1966, key: "Garigliano", clue: "Pont le plus haut de Paris.", x: 86, y: 460, angle: -70 },
  { id: 37, name: "Pont aval", sector: 5, type: "Routier (Périph.)", banks: "15e ↔ 16e", year: 1968, key: "Aval", clue: "Périphérique Ouest (sortie).", x: 65, y: 502, angle: -70 }
];

export function getBridgeById(id: number): BridgeInfo | undefined {
  return BRIDGES.find(b => b.id === id);
}

export function getBridgesBySector(sectorId: number): BridgeInfo[] {
  return BRIDGES.filter(b => b.sector === sectorId);
}

export function getNextBridgeId(currentId: number): number {
  return currentId < 37 ? currentId + 1 : 1;
}

export function getPrevBridgeId(currentId: number): number {
  return currentId > 1 ? currentId - 1 : 37;
}

export function parseViewBox(vbStr: string): ViewBoxRect {
  const parts = vbStr.trim().split(/\s+/).map(Number);
  return {
    x: parts[0] || 0,
    y: parts[1] || 0,
    w: parts[2] || 1000,
    h: parts[3] || 560
  };
}

export function formatViewBox(vb: ViewBoxRect): string {
  return `${Math.round(vb.x)} ${Math.round(vb.y)} ${Math.round(vb.w)} ${Math.round(vb.h)}`;
}

export function zoomViewBox(
  current: ViewBoxRect,
  factor: number,
  minW = 100,
  maxW = 1000
): ViewBoxRect {
  const newW = Math.max(minW, Math.min(maxW, current.w * factor));
  const newH = newW * (current.h / current.w);
  const dx = (newW - current.w) / 2;
  const dy = (newH - current.h) / 2;
  return {
    x: current.x - dx,
    y: current.y - dy,
    w: newW,
    h: newH
  };
}

export function panViewBox(current: ViewBoxRect, dx: number, dy: number): ViewBoxRect {
  return {
    x: current.x + dx,
    y: current.y + dy,
    w: current.w,
    h: current.h
  };
}

export function calculateViewBox(mode: 'follow' | 'sector' | 'full', bridge: BridgeInfo): string {
  if (mode === 'sector') {
    return SECTORS[bridge.sector]?.box || "35 95 935 440";
  }
  if (mode === 'follow') {
    const isIslands = bridge.sector === 2 || bridge.sector === 3;
    const w = isIslands ? 185 : 250;
    const h = isIslands ? 115 : 155;
    return `${Math.max(20, Math.round(bridge.x - w / 2))} ${Math.max(80, Math.round(bridge.y - h / 2))} ${w} ${h}`;
  }
  return "35 95 935 440";
}

export function calculateMasteryStats(masteredIds: Set<number> | number[], total = 37): { count: number; percent: number; isComplete: boolean } {
  const count = (masteredIds instanceof Set ? masteredIds.size : new Set(masteredIds).size);
  const percent = Math.min(100, Math.round((count / total) * 100));
  return {
    count,
    percent,
    isComplete: count >= total
  };
}

export function normalizeBridgeText(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .replace(/[-]/g, " ")
    .trim();
}

export function validateBridgeAnswer(userInput: string, targetBridgeName: string): boolean {
  const val = normalizeBridgeText(userInput);
  const ref = normalizeBridgeText(targetBridgeName);
  return val.length >= 3 && (ref.includes(val) || val.includes(ref));
}
