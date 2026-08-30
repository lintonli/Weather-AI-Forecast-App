import { SunIcon, MoonIcon, CloudIcon, FogIcon, CloudRainIcon, CloudSnowIcon, BoltIcon } from './Icons';
import { getWeatherCodeInfo } from '../weatherCodes';

interface Props {
  code: number | null;
  isDay?: boolean;
  size?: number;
}

export default function WeatherIcon({ code, isDay = true, size = 20 }: Props) {
  const { category } = getWeatherCodeInfo(code);

  switch (category) {
    case 'clear':
      return isDay ? <SunIcon size={size} /> : <MoonIcon size={size} />;
    case 'fog':
      return <FogIcon size={size} />;
    case 'drizzle':
    case 'rain':
      return <CloudRainIcon size={size} />;
    case 'snow':
      return <CloudSnowIcon size={size} />;
    case 'storm':
      return <BoltIcon size={size} />;
    default:
      return <CloudIcon size={size} />;
  }
}
