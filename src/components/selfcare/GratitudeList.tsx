import { Plus, Star, Trash2 } from 'lucide-react';
import { KeyboardEvent, useState } from 'react';
import type { GratitudeItem } from '../../services/selfCareService';

interface Props {
  items: GratitudeItem[];
  loading: boolean;
  onAdd: (text: string) => void;
  onRemove: (item: GratitudeItem) => void;
}

export default function GratitudeList({ items, loading, onAdd, onRemove }: Props) {
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
    <section className="bg-white rounded-2xl p-8 shadow-soft" aria-label="Gratitude list">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Gratitude List</h2>
      {loading ? (
        <p className="text-sm text-gray-500 mb-4">Loading your gratitude list…</p>
      ) : null}
      <div className="space-y-4 mb-6">
        {items.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:shadow-soft transition-all motion-safe:transition-opacity motion-safe:duration-200"
          >
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
            <p className="text-gray-700">{item.text}</p>
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove gratitude item"
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
          placeholder="What are you grateful for today?"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-mint-500"
          aria-label="New gratitude item"
        />
        <button
          onClick={submit}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-medium hover:shadow-soft transition-all"
          aria-label="Add gratitude item"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
