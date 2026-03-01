import { CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { KeyboardEvent, useState } from 'react';
import type { WinEntry } from '../../services/selfCareService';

interface Props {
  wins: WinEntry[];
  loading: boolean;
  onAdd: (text: string) => void;
  onRemove: (win: WinEntry) => void;
}

export default function WinsTracker({ wins, loading, onAdd, onRemove }: Props) {
  const [text, setText] = useState('');
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };
  const submit = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onAdd(trimmed);
      setText('');
    }
  };

  return (
    <section className="bg-white rounded-2xl p-8 shadow-soft" aria-label="Small wins tracker">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Small Wins Tracker</h2>
      {loading ? (
        <p className="text-sm text-gray-500 mb-4">Loading your wins…</p>
      ) : null}
      <div className="space-y-3 mb-6">
        {wins.map(win => (
          <div key={win.id} className="flex items-start gap-3 p-4 bg-mint-50 rounded-lg border border-mint-200 motion-safe:transition-opacity motion-safe:duration-200">
            <CheckCircle2 className="w-5 h-5 text-mint-600 flex-shrink-0 mt-0.5 fill-mint-600" />
            <div className="flex-1">
              <p className="text-gray-900 font-medium">{win.text}</p>
              <p className="text-xs text-gray-500">{win.date}</p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(win)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove win"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyPress={handleKey}
          placeholder="Add a win (any size counts!)"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-mint-500"
          aria-label="New win entry"
        />
        <button
          onClick={submit}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-medium hover:shadow-soft transition-all"
          aria-label="Add win"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
