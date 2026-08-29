import { PinIcon, GlobeIcon } from './Icons';

interface Props {
  onLocate: () => void;
  onDetectIp: () => void;
  units: 'metric' | 'imperial';
  onUnitsChange: (units: 'metric' | 'imperial') => void;
}

export default function QuickActions({ onLocate, onDetectIp, units, onUnitsChange }: Props) {
  return (
    <section className="quick-actions">
      <button type="button" onClick={onLocate}><PinIcon size={16} /> Use my location</button>
      <button type="button" onClick={onDetectIp}><GlobeIcon size={16} /> Detect by IP</button>
      <select value={units} onChange={(e) => onUnitsChange(e.target.value as 'metric' | 'imperial')}>
        <option value="metric">°C (metric)</option>
        <option value="imperial">°F (imperial)</option>
      </select>
    </section>
  );
}
