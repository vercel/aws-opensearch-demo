import { getWeatherDashboard } from "@/lib/timeseries/queries";
import { WeatherDashboardView } from "@/components/weather-dashboard";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ station?: string; hours?: string }>;
};

export default async function TimeSeriesPage({ searchParams }: Props) {
  const params = await searchParams;
  const hours = params.hours ? parseInt(params.hours) : 48;
  const dashboard = await getWeatherDashboard(params.station, hours);

  return <WeatherDashboardView data={dashboard} activeStation={params.station || ""} activeHours={hours} />;
}
