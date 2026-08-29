import { useState } from 'react';
import { fetchUsage } from '../api';
import type { UsageStats } from '../types';

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
    <footer className="app-footer">
      <button type="button" onClick={loadUsage}>View API usage</button>
      {error && <span className="muted">{error}</span>}
      {usage && (
        <span className="muted">
          {usage.requests_used ?? '?'} / {usage.requests_limit ?? '?'} requests used this period
        </span>
      )}
    </footer>
  );
}
