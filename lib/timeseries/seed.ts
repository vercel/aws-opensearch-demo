import { config } from "dotenv";
import path from "path";
import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { defaultProvider } from "@aws-sdk/credential-provider-node";

config({ path: path.resolve(process.cwd(), ".env.local") });

const TIMESERIES_ENDPOINT =
  process.env.TIMESERIES_OPENSEARCH_ENDPOINT ||
  "https://vbo1rhe5zcrxqndiyafg.us-east-1.aoss.amazonaws.com";

const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const INDEX_NAME = "weather";

// Weather stations
const stations = [
  { id: "tokyo", name: "Tokyo", lat: 35.68, lon: 139.69, baseTemp: 22, baseHumidity: 65, baseWind: 12, baseRainfall: 2.5 },
  { id: "london", name: "London", lat: 51.51, lon: -0.13, baseTemp: 14, baseHumidity: 75, baseWind: 18, baseRainfall: 3.2 },
  { id: "nyc", name: "New York", lat: 40.71, lon: -74.01, baseTemp: 18, baseHumidity: 60, baseWind: 15, baseRainfall: 2.8 },
  { id: "sydney", name: "Sydney", lat: -33.87, lon: 151.21, baseTemp: 24, baseHumidity: 55, baseWind: 20, baseRainfall: 1.8 },
  { id: "paris", name: "Paris", lat: 48.86, lon: 2.35, baseTemp: 16, baseHumidity: 70, baseWind: 14, baseRainfall: 2.1 },
  { id: "dubai", name: "Dubai", lat: 25.20, lon: 55.27, baseTemp: 35, baseHumidity: 45, baseWind: 10, baseRainfall: 0.2 },
  { id: "mumbai", name: "Mumbai", lat: 19.08, lon: 72.88, baseTemp: 30, baseHumidity: 80, baseWind: 8, baseRainfall: 5.0 },
  { id: "berlin", name: "Berlin", lat: 52.52, lon: 13.41, baseTemp: 13, baseHumidity: 68, baseWind: 16, baseRainfall: 1.9 },
];

function generateReading(station: typeof stations[0], hour: number, dayOffset: number) {
  // Simulate daily temperature cycle (cooler at night, warmer midday)
  const tempCycle = Math.sin((hour - 6) * Math.PI / 12) * 5;
  // Add some random variation
  const tempNoise = (Math.random() - 0.5) * 4;
  // Day-to-day variation
  const dayVariation = Math.sin(dayOffset * 0.3) * 3;

  const temperature = +(station.baseTemp + tempCycle + tempNoise + dayVariation).toFixed(1);
  const humidity = +(station.baseHumidity + (Math.random() - 0.5) * 15 - tempCycle * 2).toFixed(1);
  const windSpeed = +(station.baseWind + (Math.random() - 0.5) * 10).toFixed(1);
  const rainfall = +(Math.max(0, station.baseRainfall + (Math.random() - 0.7) * 5)).toFixed(1);
  const pressure = +(1013 + (Math.random() - 0.5) * 20 + Math.sin(dayOffset * 0.5) * 5).toFixed(1);
  const uvIndex = +(Math.max(0, Math.min(11, (hour >= 6 && hour <= 18) ? (5 + tempCycle * 0.8 + (Math.random() - 0.5) * 3) : 0))).toFixed(0);

  return {
    station_id: station.id,
    station_name: station.name,
    location: { lat: station.lat, lon: station.lon },
    temperature,
    humidity: Math.max(20, Math.min(100, humidity)),
    wind_speed: Math.max(0, windSpeed),
    rainfall: Math.max(0, rainfall),
    pressure,
    uv_index: +uvIndex,
    conditions: rainfall > 3 ? "Rainy" : rainfall > 0.5 ? "Cloudy" : humidity > 80 ? "Foggy" : "Clear",
  };
}

async function main() {
  const client = new Client({
    ...AwsSigv4Signer({
      region: AWS_REGION,
      service: "aoss",
      getCredentials: () => defaultProvider()(),
    }),
    node: TIMESERIES_ENDPOINT,
  });

  // Delete index if exists
  try {
    await client.indices.delete({ index: INDEX_NAME });
    console.log(`Deleted existing index "${INDEX_NAME}".`);
  } catch (e: any) {
    console.log("Index does not exist yet, creating fresh.");
  }

  // Create index
  console.log(`Creating index "${INDEX_NAME}"...`);
  await client.indices.create({
    index: INDEX_NAME,
    body: {
      mappings: {
        properties: {
          "@timestamp": { type: "date" },
          station_id: { type: "keyword" },
          station_name: { type: "keyword" },
          location: { type: "geo_point" },
          temperature: { type: "float" },
          humidity: { type: "float" },
          wind_speed: { type: "float" },
          rainfall: { type: "float" },
          pressure: { type: "float" },
          uv_index: { type: "integer" },
          conditions: { type: "keyword" },
        },
      },
    },
  });
  console.log("Index created. Waiting for it to become ready...");
  await new Promise((r) => setTimeout(r, 10000));

  // Generate 7 days of hourly data for all stations
  const now = new Date();
  const docs: any[] = [];

  for (let day = 6; day >= 0; day--) {
    for (let hour = 0; hour < 24; hour++) {
      for (const station of stations) {
        const timestamp = new Date(now);
        timestamp.setDate(timestamp.getDate() - day);
        timestamp.setHours(hour, 0, 0, 0);

        const reading = generateReading(station, hour, day);
        docs.push({
          "@timestamp": timestamp.toISOString(),
          ...reading,
        });
      }
    }
  }

  console.log(`Generated ${docs.length} weather readings (${stations.length} stations × 7 days × 24 hours)`);

  // Bulk index in batches
  const batchSize = 200;
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    const body = batch.flatMap((doc) => [
      { index: { _index: INDEX_NAME } },
      doc,
    ]);
    const r = await client.bulk({ body });
    if (r.body.errors) {
      const errors = r.body.items.filter((item: any) => item.index?.error);
      console.error(`Batch ${Math.floor(i / batchSize) + 1} had ${errors.length} errors`);
    } else {
      console.log(`  Batch ${Math.floor(i / batchSize) + 1}: indexed ${Math.min(i + batchSize, docs.length)} / ${docs.length}`);
    }
  }

  await new Promise((r) => setTimeout(r, 3000));
  const count = await client.count({ index: INDEX_NAME });
  console.log(`\nTotal documents in index: ${count.body.count}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
