import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SectorSelector } from './components/SectorSelector';
import { HydrometryCard } from './components/HydrometryCard';
import { WeatherGrid } from './components/WeatherGrid';
import { HourlyCarousel } from './components/HourlyCarousel';
import { BriefingShareModal } from './components/BriefingShareModal';
import { BottomStickyBar } from './components/BottomStickyBar';
import { Toast } from './components/Toast';
import { SectorMode, RiverStationData, WeatherData } from './types';
import {
  computeRiverVelocityMs,
  degreesToCardinal,
  formatRelativeTime,
} from './utils/hydroLogic';

// Baseline realistic seed data for instant first-paint and high offline resilience
const INITIAL_SEINE: RiverStationData = {
  stationCode: 'F700000103',
  name: 'LA SEINE — Pont d\'Austerlitz',
  location: 'Cale : Écluse Port de l\'Arsenal (PK 167.5)',
  flowM3s: 280,
  flowTrend: 'Stable (±4 m³/s)',
  heightM: 1.42,
  heightTrendCm: 2,
  obsTime: new Date().toISOString(),
  currentVelocityMs: 0.65,
  currentVelocityKmh: 2.3,
};

const INITIAL_MARNE: RiverStationData = {
  stationCode: 'F664000104',
  name: 'LA MARNE — Gournay & Créteil',
  location: 'Confluence Charenton & Bief de Créteil (PK 152)',
  flowM3s: 92,
  flowTrend: 'Stable (±2 m³/s)',
  heightM: 1.15,
  heightTrendCm: 0,
  obsTime: new Date().toISOString(),
  currentVelocityMs: 0.64,
  currentVelocityKmh: 2.3,
};

const INITIAL_WEATHER: WeatherData = {
  airTemp: 16.5,
  apparentTemp: 15.8,
  estimatedWaterTemp: 13.8,
  windSpeedKmh: 14,
  windGustsKmh: 24,
  windDirDeg: 235,
  windDirCardinal: 'SO',
  precipNow: 0.0,
  precipProb: 15,
  precip3h: 0.2,
  uvNow: 2.8,
  uvMax: 4.5,
  weatherCode: 2,
  sunrise: '07:22',
  sunset: '19:48',
  hourly: [
    { time: '10:00', temp: 16.5, wind: 14, gusts: 24, precip: 0.0, prob: 10, uv: 2.8, weatherCode: 2 },
    { time: '11:00', temp: 17.2, wind: 16, gusts: 26, precip: 0.0, prob: 15, uv: 3.5, weatherCode: 2 },
    { time: '12:00', temp: 18.0, wind: 18, gusts: 28, precip: 0.1, prob: 20, uv: 4.2, weatherCode: 3 },
    { time: '13:00', temp: 18.4, wind: 19, gusts: 30, precip: 0.2, prob: 25, uv: 4.5, weatherCode: 3 },
    { time: '14:00', temp: 18.2, wind: 17, gusts: 27, precip: 0.0, prob: 20, uv: 3.8, weatherCode: 2 },
    { time: '15:00', temp: 17.8, wind: 15, gusts: 25, precip: 0.0, prob: 10, uv: 2.9, weatherCode: 1 },
  ],
};

export default function App() {
  // SEINE PAR DÉFAUT
  const [sector, setSector] = useState<SectorMode>('seine');
  const [seine, setSeine] = useState<RiverStationData>(INITIAL_SEINE);
  const [marne, setMarne] = useState<RiverStationData>(INITIAL_MARNE);
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [lastSyncIso, setLastSyncIso] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState<boolean>(false);

  // Amélioration 3 : Mode Nuit Nautique
  const [isNightMode, setIsNightMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bpi_night_mode') === 'true';
    } catch {
      return false;
    }
  });

  const toggleNightMode = useCallback(() => {
    setIsNightMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('bpi_night_mode', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // Fetch hydrological and meteorological data
  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      // 1. Open-Meteo AROME Forecast for Paris Austerlitz (48.8447, 2.3662)
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=48.8447&longitude=2.3662&past_days=7&forecast_days=2&current=temperature_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_10m,wind_gusts_10m,uv_index,weather_code,soil_temperature_18cm,soil_temperature_54cm&daily=sunrise,sunset&timezone=Europe%2FParis`;

      // 2. Hub'Eau Vigicrues API for Seine (F700000103)
      const seineQUrl = `https://hubeau.eaufrance.fr/api/v2/hydrometrie/observations_tr?code_entite=F700000103&grandeur_hydro=Q&size=20&sort=desc`;
      const seineHUrl = `https://hubeau.eaufrance.fr/api/v2/hydrometrie/observations_tr?code_entite=F700000103&grandeur_hydro=H&size=20&sort=desc`;

      // 3. Hub'Eau Vigicrues API for Marne (F664000104 / 404)
      const marneQUrl = `https://hubeau.eaufrance.fr/api/v2/hydrometrie/observations_tr?code_entite=F664000104,F664000404&grandeur_hydro=Q&size=20&sort=desc`;
      const marneHUrl = `https://hubeau.eaufrance.fr/api/v2/hydrometrie/observations_tr?code_entite=F664000404,F664000104&grandeur_hydro=H&size=20&sort=desc`;

      const [resW, resSeineQ, resSeineH, resMarneQ, resMarneH] = await Promise.allSettled([
        fetch(weatherUrl),
        fetch(seineQUrl),
        fetch(seineHUrl),
        fetch(marneQUrl),
        fetch(marneHUrl),
      ]);

      // Parse Weather
      if (resW.status === 'fulfilled' && resW.value.ok) {
        const data = await resW.value.json();
        const current = data.current;
        const hourly = data.hourly;
        const daily = data.daily;

        const nowISO = current.time.slice(0, 13);
        let currentHourIdx = hourly.time.findIndex((t: string) => t.startsWith(nowISO));
        if (currentHourIdx === -1) currentHourIdx = Math.max(0, hourly.time.length - 24);

        // Water temp estimation from 7-day average air & deep ground
        const past7DaysTemps = hourly.temperature_2m
          .slice(Math.max(0, currentHourIdx - 168), currentHourIdx + 1)
          .filter((v: number | null) => v !== null);
        const deepTemp54 = hourly.soil_temperature_54cm ? hourly.soil_temperature_54cm[currentHourIdx] : null;

        let estimatedWater = 14.0;
        if (past7DaysTemps.length > 24) {
          const mean7d = past7DaysTemps.reduce((a: number, b: number) => a + b, 0) / past7DaysTemps.length;
          estimatedWater =
            deepTemp54 !== null
              ? Number((mean7d * 0.65 + deepTemp54 * 0.35).toFixed(1))
              : Number((mean7d * 0.92 + 1.2).toFixed(1));
        }

        // Sum precipitation for next 3h
        let precipSum3h = 0;
        for (let i = currentHourIdx; i < Math.min(currentHourIdx + 3, hourly.precipitation.length); i++) {
          precipSum3h += hourly.precipitation[i] || 0;
        }

        // Next 6 hours array
        const next6: any[] = [];
        for (let i = currentHourIdx; i < Math.min(currentHourIdx + 6, hourly.time.length); i++) {
          next6.push({
            time: hourly.time[i].slice(11, 16),
            temp: hourly.temperature_2m[i],
            wind: hourly.wind_speed_10m[i],
            gusts: hourly.wind_gusts_10m[i],
            precip: hourly.precipitation[i],
            prob: hourly.precipitation_probability[i],
            uv: hourly.uv_index[i],
            weatherCode: hourly.weather_code ? hourly.weather_code[i] : current.weather_code,
          });
        }

        const sunriseTime = daily?.sunrise?.[0] ? daily.sunrise[0].slice(11, 16) : '07:25';
        const sunsetTime = daily?.sunset?.[0] ? daily.sunset[0].slice(11, 16) : '19:45';

        setWeather({
          airTemp: current.temperature_2m,
          apparentTemp: current.apparent_temperature,
          estimatedWaterTemp: estimatedWater,
          windSpeedKmh: current.wind_speed_10m,
          windGustsKmh: current.wind_gusts_10m,
          windDirDeg: current.wind_direction_10m,
          windDirCardinal: degreesToCardinal(current.wind_direction_10m),
          precipNow: current.precipitation ?? 0,
          precipProb: hourly.precipitation_probability[currentHourIdx] ?? 0,
          precip3h: Number(precipSum3h.toFixed(1)),
          uvNow: current.uv_index ?? 0,
          uvMax: hourly.uv_index ? Math.max(...hourly.uv_index.slice(currentHourIdx, currentHourIdx + 24)) : 4.0,
          weatherCode: current.weather_code,
          sunrise: sunriseTime,
          sunset: sunsetTime,
          hourly: next6,
        });
      }

      // Parse Seine
      let seineFlow = seine.flowM3s;
      let seineTrend = seine.flowTrend;
      let seineTime = seine.obsTime;
      let seineHeight = seine.heightM;
      let seineHeightTrend = seine.heightTrendCm;

      if (resSeineQ.status === 'fulfilled' && resSeineQ.value.ok) {
        const dataQ = await resSeineQ.value.json();
        if (dataQ.data && dataQ.data.length > 0) {
          seineFlow = dataQ.data[0].resultat_obs / 1000;
          seineTime = dataQ.data[0].date_obs;
          const oldestQ = dataQ.data[dataQ.data.length - 1].resultat_obs / 1000;
          const diffQ = seineFlow - oldestQ;
          seineTrend =
            diffQ > 6
              ? `Hausse (+${Math.round(diffQ)} m³/s)`
              : diffQ < -6
              ? `Baisse (${Math.round(diffQ)} m³/s)`
              : 'Stable (±3 m³/s)';
        }
      }

      if (resSeineH.status === 'fulfilled' && resSeineH.value.ok) {
        const dataH = await resSeineH.value.json();
        if (dataH.data && dataH.data.length > 0) {
          seineHeight = dataH.data[0].resultat_obs / 1000;
          const oldestH = dataH.data[dataH.data.length - 1].resultat_obs / 1000;
          seineHeightTrend = Math.round((seineHeight - oldestH) * 100);
        }
      }

      const vSeineMs = computeRiverVelocityMs(seineFlow, seineHeight, true);
      setSeine({
        stationCode: 'F700000103',
        name: 'LA SEINE — Pont d\'Austerlitz',
        location: 'Cale : Écluse Port de l\'Arsenal (PK 167.5)',
        flowM3s: seineFlow,
        flowTrend: seineTrend,
        heightM: seineHeight,
        heightTrendCm: seineHeightTrend,
        obsTime: seineTime,
        currentVelocityMs: vSeineMs,
        currentVelocityKmh: Number((vSeineMs * 3.6).toFixed(1)),
      });

      // Parse Marne
      let marneFlow = marne.flowM3s;
      let marneTrend = marne.flowTrend;
      let marneTime = marne.obsTime;
      let marneHeight = marne.heightM;
      let marneHeightTrend = marne.heightTrendCm;

      if (resMarneQ.status === 'fulfilled' && resMarneQ.value.ok) {
        const dataQ = await resMarneQ.value.json();
        if (dataQ.data && dataQ.data.length > 0) {
          marneFlow = dataQ.data[0].resultat_obs / 1000;
          marneTime = dataQ.data[0].date_obs;
          const oldestQ = dataQ.data[dataQ.data.length - 1].resultat_obs / 1000;
          const diffQ = marneFlow - oldestQ;
          marneTrend =
            diffQ > 4
              ? `Hausse (+${Math.round(diffQ)} m³/s)`
              : diffQ < -4
              ? `Baisse (${Math.round(diffQ)} m³/s)`
              : 'Stable (±2 m³/s)';
        }
      }

      if (resMarneH.status === 'fulfilled' && resMarneH.value.ok) {
        const dataH = await resMarneH.value.json();
        if (dataH.data && dataH.data.length > 0) {
          marneHeight = dataH.data[0].resultat_obs / 1000;
          const oldestH = dataH.data[dataH.data.length - 1].resultat_obs / 1000;
          marneHeightTrend = Math.round((marneHeight - oldestH) * 100);
        }
      }

      const vMarneMs = computeRiverVelocityMs(marneFlow, marneHeight, false);
      setMarne({
        stationCode: 'F664000104',
        name: 'LA MARNE — Gournay & Créteil',
        location: 'Confluence Charenton & Bief de Créteil (PK 152)',
        flowM3s: marneFlow,
        flowTrend: marneTrend,
        heightM: marneHeight,
        heightTrendCm: marneHeightTrend,
        obsTime: marneTime,
        currentVelocityMs: vMarneMs,
        currentVelocityKmh: Number((vMarneMs * 3.6).toFixed(1)),
      });

      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
      setLastSyncIso(now.toISOString());
    } catch (err) {
      setLastSyncTime('Hors-ligne');
      setLastSyncIso(new Date().toISOString());
    } finally {
      setIsLoading(false);
    }
  }, [seine.flowM3s, seine.flowTrend, seine.heightM, seine.heightTrendCm, seine.obsTime, marne.flowM3s, marne.flowTrend, marne.heightM, marne.heightTrendCm, marne.obsTime]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const relativeSyncTime = formatRelativeTime(lastSyncIso);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors pb-20 sm:pb-8 ${
        isNightMode ? 'bg-[#080E1B] text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Header */}
      <Header
        sector={sector}
        lastSyncTime={lastSyncTime}
        relativeSyncTime={relativeSyncTime}
        isLoading={isLoading}
        isNightMode={isNightMode}
        onToggleNightMode={toggleNightMode}
        onRefresh={() => {
          fetchData();
          showToast('Actualisation des capteurs Vigicrues...');
        }}
        onOpenBriefing={() => setIsBriefingOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5 space-y-3.5 sm:space-y-5 flex-grow">
        {/* Sector Selector */}
        <section aria-label="Secteur d'intervention">
          <SectorSelector
            activeSector={sector}
            onSelectSector={setSector}
            isNightMode={isNightMode}
          />
        </section>

        {/* Hydrométrie Vigicrues (Seine / Marne) */}
        <section aria-label="Données hydrométriques">
          {sector === 'seine' ? (
            <HydrometryCard station={seine} isPrimary={true} isNightMode={isNightMode} />
          ) : (
            <HydrometryCard station={marne} isPrimary={false} isNightMode={isNightMode} />
          )}
        </section>

        {/* Météo & Atmosphère */}
        <section aria-label="Conditions météo">
          <WeatherGrid weather={weather} isNightMode={isNightMode} />
        </section>

        {/* Prévisions Horaires (+6h) */}
        <section aria-label="Prévisions horaires">
          <HourlyCarousel hourly={weather.hourly} isNightMode={isNightMode} />
        </section>
      </main>

      {/* Barre d'action rapide sur mobile (au pouce) */}
      <BottomStickyBar
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onRefresh={() => {
          fetchData();
          showToast('Actualisation des capteurs...');
        }}
        isLoading={isLoading}
        isNightMode={isNightMode}
        onToggleNightMode={toggleNightMode}
      />

      {/* Modal Briefing / Point Nav */}
      <BriefingShareModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        sector={sector}
        seine={seine}
        marne={marne}
        weather={weather}
        isNightMode={isNightMode}
        onShowToast={showToast}
      />

      <Toast message={toastMessage} />
    </div>
  );
}
