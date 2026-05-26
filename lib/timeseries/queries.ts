import { timeseriesClient } from "./client";

const INDEX_NAME = "weather";

export interface StationSummary {
  stationId: string;
  stationName: string;
  avgTemp: number;
  avgHumidity: number;
  avgWind: number;
  totalRainfall: number;
  currentConditions: string;
}

export interface TimeSeriesPoint {
  time: string;
  value: number;
}

export interface WeatherDashboard {
  stations: StationSummary[];
  temperatureOverTime: { station: string; data: TimeSeriesPoint[] }[];
  conditionsBreakdown: { key: string; count: number }[];
  totalReadings: number;
  timeRange: string;
}

export async function getWeatherDashboard(
  stationFilter?: string,
  hours: number = 48,
): Promise<WeatherDashboard> {
  try {
    const now = new Date();
    const from = new Date(now.getTime() - hours * 60 * 60 * 1000);

    const filter: any[] = [
      { range: { "@timestamp": { gte: from.toISOString(), lte: now.toISOString() } } },
    ];
    if (stationFilter) {
      filter.push({ term: { station_id: stationFilter } });
    }

    const response = await timeseriesClient.search({
      index: INDEX_NAME,
      body: {
        size: 0,
        query: { bool: { filter } },
        aggs: {
          by_station: {
            terms: { field: "station_id", size: 10 },
            aggs: {
              station_name: { terms: { field: "station_name", size: 1 } },
              avg_temp: { avg: { field: "temperature" } },
              avg_humidity: { avg: { field: "humidity" } },
              avg_wind: { avg: { field: "wind_speed" } },
              total_rainfall: { sum: { field: "rainfall" } },
              latest_conditions: {
                top_hits: { size: 1, sort: [{ "@timestamp": "desc" }], _source: ["conditions"] },
              },
            },
          },
          temp_over_time: {
            date_histogram: {
              field: "@timestamp",
              fixed_interval: hours <= 24 ? "1h" : "3h",
            },
            aggs: {
              by_station: {
                terms: { field: "station_name", size: 8 },
                aggs: {
                  avg_temp: { avg: { field: "temperature" } },
                },
              },
            },
          },
          conditions: {
            terms: { field: "conditions", size: 10 },
          },
        },
      },
    });

    const aggs = response.body.aggregations;
    const total = response.body.hits.total;

    // Station summaries
    const stations: StationSummary[] = aggs.by_station.buckets.map((b: any) => ({
      stationId: b.key,
      stationName: b.station_name.buckets[0]?.key || b.key,
      avgTemp: +b.avg_temp.value.toFixed(1),
      avgHumidity: +b.avg_humidity.value.toFixed(0),
      avgWind: +b.avg_wind.value.toFixed(1),
      totalRainfall: +b.total_rainfall.value.toFixed(1),
      currentConditions: b.latest_conditions.hits.hits[0]?._source?.conditions || "Unknown",
    }));

    // Temperature over time per station
    const stationNames = [...new Set(stations.map((s) => s.stationName))];
    const temperatureOverTime = stationNames.slice(0, 4).map((name) => ({
      station: name,
      data: aggs.temp_over_time.buckets
        .map((bucket: any) => {
          const stationBucket = bucket.by_station.buckets.find(
            (s: any) => s.key === name,
          );
          return stationBucket
            ? {
                time: new Date(bucket.key_as_string).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                value: +stationBucket.avg_temp.value.toFixed(1),
              }
            : null;
        })
        .filter(Boolean) as TimeSeriesPoint[],
    }));

    // Conditions breakdown
    const conditionsBreakdown = aggs.conditions.buckets.map((b: any) => ({
      key: b.key,
      count: b.doc_count,
    }));

    return {
      stations: stations.sort((a, b) => b.avgTemp - a.avgTemp),
      temperatureOverTime,
      conditionsBreakdown,
      totalReadings: typeof total === "number" ? total : total.value,
      timeRange: `Last ${hours} hours`,
    };
  } catch (error: any) {
    console.error("Weather dashboard query failed:", error.message);
    return {
      stations: [],
      temperatureOverTime: [],
      conditionsBreakdown: [],
      totalReadings: 0,
      timeRange: `Last ${hours} hours`,
    };
  }
}
