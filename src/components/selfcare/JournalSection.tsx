import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  initialText: string;
  lastUpdatedAt?: Date | null;
  canEdit: boolean;
  saving: boolean;
  onSave: (text: string) => void;
}

export default function JournalSection({
  initialText,
  lastUpdatedAt,
  canEdit,
  saving,
  onSave,
}: Props) {
  const [text, setText] = useState(initialText);

  // if parent updates (snapshot refresh) we want to reflect
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const disableMsg = !canEdit ? (
    <p className="text-sm text-yellow-600">You can update again tomorrow.</p>
  ) : null;

  const lastLine = lastUpdatedAt ? (
    <div className="flex items-center gap-2 mb-2">
      <Calendar className="w-5 h-5 text-gray-600" />
      <p className="text-sm text-gray-600">
        Last saved {lastUpdatedAt.toLocaleDateString()} at{' '}
        {lastUpdatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  ) : null;

  return (
    <section className="bg-white rounded-2xl p-8 shadow-soft mb-12" aria-label="Mood journal">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mood Journal</h2>
      <div className="mb-6">
        {lastLine}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write about your day, your feelings, or anything on your mind. There are no rules here."
          className="w-full px-4 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-mint-500 resize-none"
          rows={6}
          disabled={!canEdit || saving}
          aria-label="Journal entry"
        ></textarea>
      </div>
      {disableMsg}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setText('')}
          className="flex-1 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
        >
          Clear journal
        </button>
        <button
          type="button"
          disabled={!canEdit || saving}
          onClick={() => onSave(text)}
          className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Entry'}
        </button>
      </div>
    </section>
  );
}
