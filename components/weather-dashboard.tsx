"use client";

import { useRouter } from "next/navigation";
import type { WeatherDashboard } from "@/lib/timeseries/queries";
import { Thermometer, Droplets, Wind, CloudRain, Sun, Cloud } from "lucide-react";

interface Props {
  data: WeatherDashboard;
  activeStation: string;
  activeHours: number;
}

const conditionIcons: Record<string, React.ReactNode> = {
  Clear: <Sun className="w-4 h-4 text-yellow-500" />,
  Cloudy: <Cloud className="w-4 h-4 text-gray-400" />,
  Rainy: <CloudRain className="w-4 h-4 text-blue-500" />,
  Foggy: <Cloud className="w-4 h-4 text-gray-300" />,
};

const stationColors = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#6366f1", "#ec4899", "#14b8a6"];

export function WeatherDashboardView({ data, activeStation, activeHours }: Props) {
  const router = useRouter();

  function setTimeRange(hours: number) {
    const params = new URLSearchParams();
    params.set("hours", String(hours));
    if (activeStation) params.set("station", activeStation);
    router.push(`/timeseries?${params.toString()}`);
  }

  function setStation(station: string) {
    const params = new URLSearchParams();
    params.set("hours", String(activeHours));
    if (station) params.set("station", station);
    router.push(`/timeseries?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {[12, 24, 48, 168].map((h) => (
            <button
              key={h}
              onClick={() => setTimeRange(h)}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                activeHours === h
                  ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400"
              }`}
            >
              {h <= 24 ? `${h}h` : `${h / 24}d`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{data.totalReadings.toLocaleString()} readings</span>
          <span>•</span>
          <span>{data.timeRange}</span>
        </div>
      </div>

      {/* Station filter pills */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setStation("")}
          className={`text-xs px-2 py-1 rounded ${!activeStation ? "bg-gray-900 text-white dark:bg-white dark:text-black" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
        >
          All Stations
        </button>
        {data.stations.map((s) => (
          <button
            key={s.stationId}
            onClick={() => setStation(s.stationId)}
            className={`text-xs px-2 py-1 rounded ${activeStation === s.stationId ? "bg-gray-900 text-white dark:bg-white dark:text-black" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
          >
            {s.stationName}
          </button>
        ))}
      </div>

      {/* Station cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {data.stations.slice(0, 8).map((station) => (
          <div
            key={station.stationId}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-900 cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => setStation(station.stationId)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                {station.stationName}
              </span>
              {conditionIcons[station.currentConditions] || conditionIcons.Clear}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {station.avgTemp}°C
            </div>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
              <span className="flex items-center gap-0.5">
                <Droplets className="w-3 h-3" />
                {station.avgHumidity}%
              </span>
              <span className="flex items-center gap-0.5">
                <Wind className="w-3 h-3" />
                {station.avgWind} km/h
              </span>
              <span className="flex items-center gap-0.5">
                <CloudRain className="w-3 h-3" />
                {station.totalRainfall}mm
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Temperature chart */}
      {data.temperatureOverTime.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            Temperature Over Time
          </h3>
          <div className="flex items-center gap-3 mb-3">
            {data.temperatureOverTime.map((series, i) => (
              <span key={series.station} className="flex items-center gap-1 text-[10px] text-gray-500">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stationColors[i] }} />
                {series.station}
              </span>
            ))}
          </div>
          <div className="h-40 flex items-end gap-px">
            {data.temperatureOverTime[0]?.data.map((_, idx) => (
              <div key={idx} className="flex-1 flex flex-col justify-end gap-px h-full">
                {data.temperatureOverTime.map((series, si) => {
                  const point = series.data[idx];
                  if (!point) return null;
                  const minTemp = -5;
                  const maxTemp = 45;
                  const height = ((point.value - minTemp) / (maxTemp - minTemp)) * 100;
                  return (
                    <div
                      key={si}
                      className="w-full rounded-t-sm opacity-80"
                      style={{
                        height: `${Math.max(height, 2)}%`,
                        backgroundColor: stationColors[si],
                      }}
                      title={`${series.station}: ${point.value}°C at ${point.time}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conditions breakdown */}
      {data.conditionsBreakdown.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Weather Conditions Distribution
          </h3>
          <div className="flex gap-2">
            {data.conditionsBreakdown.map((c) => {
              const total = data.conditionsBreakdown.reduce((sum, x) => sum + x.count, 0);
              const pct = ((c.count / total) * 100).toFixed(0);
              return (
                <div key={c.key} className="flex-1 text-center">
                  <div className="flex justify-center mb-1">
                    {conditionIcons[c.key] || conditionIcons.Clear}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {pct}%
                  </div>
                  <div className="text-[10px] text-gray-500">{c.key}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data.stations.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          No weather data available. Run <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">npm run seed:timeseries</code> to populate.
        </p>
      )}
    </div>
  );
}
