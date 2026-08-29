import { useState } from 'react';
import { fetchUsage } from '../api';
import type { UsageStats } from '../types';
import { ChartIcon } from './Icons';

export default function UsageBadge() {
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUsage = async () => {
    setError(null);
    try {
      setUsage(await fetchUsage());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load usage.');
    }
  };

  return (
    <section className="usage-badge">
      <h3><ChartIcon /> API Usage</h3>
      <button type="button" onClick={loadUsage}>Check usage</button>
      {error && <p className="muted">{error}</p>}
      {usage && (
        <p className="muted">
          {usage.requests_used ?? '?'} / {usage.requests_limit ?? '?'} requests used this period
        </p>
      )}
    </section>
  );
}
