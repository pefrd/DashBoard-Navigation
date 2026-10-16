export type SectorMode = 'seine' | 'marne' | 'combined';

export interface RiverStationData {
  stationCode: string;
  name: string;
  location: string;
  flowM3s: number | null;
  flowTrend: string;
  heightM: number | null;
  heightTrendCm: number | null;
  obsTime: string | null;
  currentVelocityMs: number;
  currentVelocityKmh: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  wind: number;
  gusts: number;
  precip: number;
  prob: number;
  uv: number;
  weatherCode: number;
}

export interface WeatherData {
  airTemp: number | null;
  apparentTemp: number | null;
  estimatedWaterTemp: number | null;
  windSpeedKmh: number | null;
  windGustsKmh: number | null;
  windDirDeg: number | null;
  windDirCardinal: string;
  precipNow: number;
  precipProb: number;
  precip3h: number;
  uvNow: number;
  uvMax: number;
  weatherCode: number;
  sunrise: string;
  sunset: string;
  hourly: HourlyForecast[];
}
