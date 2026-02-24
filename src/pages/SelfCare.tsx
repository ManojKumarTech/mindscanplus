import { useState } from 'react';
import { Plus, Star, CheckCircle2, Calendar, Trash2 } from 'lucide-react';

export default function SelfCare() {
  const [gratitudeItems, setGratitudeItems] = useState<string[]>([
    'My morning coffee',
    'A text from a friend',
    'The sunset today',
  ]);
  const [gratitudeInput, setGratitudeInput] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [wins, setWins] = useState([
    { id: 1, text: 'Went for a 20-minute walk', date: 'Today' },
    { id: 2, text: 'Had a conversation with someone I trust', date: 'Yesterday' },
    { id: 3, text: 'Drank 8 glasses of water', date: '2 days ago' },
  ]);
  const [newWin, setNewWin] = useState('');

  const selfCarePlan = [
    {
      category: 'Physical',
      items: ['Exercise 3x per week', 'Sleep 7-8 hours', 'Eat nutritious meals'],
      color: 'from-orange-400 to-pink-400',
      bgColor: 'bg-orange-50',
    },
    {
      category: 'Mental',
      items: ['Meditation 10 minutes daily', 'Read for pleasure', 'Take breaks from screens'],
      color: 'from-sky-400 to-blue-400',
      bgColor: 'bg-sky-50',
    },
    {
      category: 'Social',
      items: ['Call a friend weekly', 'Spend time with loved ones', 'Join a community'],
      color: 'from-mint-400 to-teal-400',
      bgColor: 'bg-mint-50',
    },
    {
      category: 'Emotional',
      items: ['Journal thoughts', 'Practice self-compassion', 'Celebrate small wins'],
      color: 'from-rose-400 to-pink-400',
      bgColor: 'bg-rose-50',
    },
  ];

  const challenges = [
    {
      title: 'Weekly Challenge: Kindness Week',
      description: 'Do one kind act every day this week',
      days: 4,
      totalDays: 7,
      color: 'from-yellow-100 to-orange-100',
    },
    {
      title: 'Weekly Challenge: Nature Time',
      description: 'Spend 15 minutes in nature daily',
      days: 2,
      totalDays: 7,
      color: 'from-green-100 to-mint-100',
    },
    {
      title: 'Weekly Challenge: Gratitude Practice',
      description: 'Write down 3 things you\'re grateful for each day',
      days: 5,
      totalDays: 7,
      color: 'from-sky-100 to-blue-100',
    },
  ];

  const addGratitude = () => {
    if (gratitudeInput.trim()) {
      setGratitudeItems([...gratitudeItems, gratitudeInput]);
      setGratitudeInput('');
    }
  };

  const addWin = () => {
    if (newWin.trim()) {
      setWins([{ id: Date.now(), text: newWin, date: 'Today' }, ...wins]);
      setNewWin('');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Self-Care & Growth</h1>
          <p className="text-gray-600">
            Build sustainable habits and celebrate your progress. You deserve this care.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <section className="bg-white rounded-2xl p-8 shadow-soft">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gratitude List</h2>
            <div className="space-y-4 mb-6">
              {gratitudeItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:shadow-soft transition-all"
                >
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                  <p className="text-gray-700">{item}</p>
                  <button
                    onClick={() => setGratitudeItems(gratitudeItems.filter((_, i) => i !== idx))}
                    className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={gratitudeInput}
                onChange={e => setGratitudeInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addGratitude()}
                placeholder="What are you grateful for today?"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-mint-500"
              />
              <button
                onClick={addGratitude}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-medium hover:shadow-soft transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-soft">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Small Wins Tracker</h2>
            <div className="space-y-3 mb-6">
              {wins.map(win => (
                <div key={win.id} className="flex items-start gap-3 p-4 bg-mint-50 rounded-lg border border-mint-200">
                  <CheckCircle2 className="w-5 h-5 text-mint-600 flex-shrink-0 mt-0.5 fill-mint-600" />
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{win.text}</p>
                    <p className="text-xs text-gray-500">{win.date}</p>
                  </div>
                  <button
                    onClick={() => setWins(wins.filter(w => w.id !== win.id))}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newWin}
                onChange={e => setNewWin(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addWin()}
                placeholder="Add a win (any size counts!)"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-mint-500"
              />
              <button
                onClick={addWin}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-medium hover:shadow-soft transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </section>
        </div>

        <section className="bg-white rounded-2xl p-8 shadow-soft mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mood Journal</h2>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <p className="text-sm text-gray-600">Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <textarea
              value={journalEntry}
              onChange={e => setJournalEntry(e.target.value)}
              placeholder="Write about your day, your feelings, or anything on your mind. There are no rules here."
              className="w-full px-4 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-mint-500 resize-none"
              rows={6}
            ></textarea>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">
              Clear
            </button>
            <button className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all">
              Save Entry
            </button>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Self-Care Plan</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {selfCarePlan.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-6 border border-gray-200 hover:shadow-softLg transition-all`}
              >
                <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${plan.color} text-white text-sm font-semibold mb-4`}>
                  {plan.category}
                </div>
                <ul className="space-y-3">
                  {plan.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-mint-600 focus:ring-mint-500 cursor-pointer"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Challenges</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {challenges.map((challenge, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-6 bg-gradient-to-br ${challenge.color} border border-gray-200 hover:shadow-softLg transition-all`}
              >
                <h3 className="font-bold text-gray-900 mb-2">{challenge.title}</h3>
                <p className="text-gray-700 text-sm mb-4">{challenge.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-gray-600">Progress</p>
                    <p className="text-xs font-semibold text-gray-600">
                      {challenge.days}/{challenge.totalDays}
                    </p>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/50 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-mint-500 to-sky-500 transition-all"
                      style={{ width: `${(challenge.days / challenge.totalDays) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <button className="w-full px-4 py-2 rounded-lg bg-white/80 font-medium text-gray-900 hover:bg-white transition-colors">
                  Update Progress
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}