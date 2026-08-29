import { SparklesIcon } from './Icons';

export default function AiSummary({ summary }: { summary: string | null }) {
  if (!summary) return null;

  return (
    <div className="ai-summary">
      <h3><SparklesIcon /> AI Summary</h3>
      <p>{summary}</p>
    </div>
  );
}
