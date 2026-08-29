import { useState } from 'react';
import { sendSms } from '../api';
import { MessageIcon } from './Icons';

export default function SmsPanel() {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ text: string; error: boolean } | null>(null);

  const describeStatus = (status: number, error?: string): string => {
    if (status === 403) return 'SMS requires a Scale plan with compliance approval on your WeatherAI account.';
    if (status === 429) return 'Monthly SMS quota exceeded.';
    return error || `Request failed with status ${status}.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      const res = await sendSms(to, message, 'weather_alert');
      if (res.ok) {
        setResult({ text: 'Message sent successfully.', error: false });
      } else {
        setResult({ text: describeStatus(res.status, res.data.error), error: true });
      }
    } catch (err) {
      setResult({ text: err instanceof Error ? err.message : 'Failed to send message.', error: true });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="sms-panel">
      <h3><MessageIcon /> Send SMS <span className="muted">(Scale plan only)</span></h3>
      <form className="sms-form" onSubmit={handleSubmit}>
        <input
          type="tel"
          placeholder="Phone e.g. +254712345678"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={160}
          required
        />
        <button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send'}</button>
      </form>
      {result && <p className={`sms-result ${result.error ? 'error' : ''}`}>{result.text}</p>}
    </section>
  );
}
