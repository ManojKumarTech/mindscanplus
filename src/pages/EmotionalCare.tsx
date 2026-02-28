import { useState } from 'react';
import { Wind, Leaf, Zap, Heart, MessageCircle, RefreshCw } from 'lucide-react';

export default function EmotionalCare() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [activeActivity, setActiveActivity] = useState<string | null>(null);

  const moods = [
    { id: 'happy', label: 'Happy', icon: '😊', color: 'from-yellow-400 to-orange-400' },
    { id: 'calm', label: 'Calm', icon: '😌', color: 'from-green-400 to-mint-400' },
    { id: 'anxious', label: 'Anxious', icon: '😰', color: 'from-blue-400 to-sky-400' },
    { id: 'sad', label: 'Sad', icon: '😢', color: 'from-indigo-400 to-purple-400' },
    { id: 'exhausted', label: 'Exhausted', icon: '😴', color: 'from-gray-400 to-slate-400' },
  ];

  const resetActivities = [
    {
      id: 'breathing',
      title: '4-7-8 Breathing',
      icon: Wind,
      description: 'A scientifically-backed breathing technique to calm your nervous system',
      steps: [
        'Find a comfortable position',
        'Breathe in slowly through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale slowly through your mouth for 8 counts',
        'Repeat 4 times',
      ],
      duration: '2 minutes',
    },
    {
      id: 'grounding',
      title: '5-4-3-2-1 Grounding',
      icon: Leaf,
      description: 'Use your senses to bring yourself back to the present moment',
      steps: [
        'Notice 5 things you can see',
        'Notice 4 things you can touch',
        'Notice 3 things you can hear',
        'Notice 2 things you can smell',
        'Notice 1 thing you can taste',
      ],
      duration: '2 minutes',
    },
    {
      id: 'relaxation',
      title: 'Progressive Relaxation',
      icon: RefreshCw,
      description: 'Release tension from your body systematically',
      steps: [
        'Start with your toes. Tense them for 5 seconds',
        'Release and feel the relaxation',
        'Move up through your body: feet, legs, stomach',
        'Continue with chest, arms, and hands',
        'Finish with neck, jaw, and face',
      ],
      duration: '2 minutes',
    },
  ];

  const hopeMessages = [
    'Your feelings are valid. You are stronger than you think.',
    'Every difficult moment is temporary. This will pass.',
    'You deserve kindness, especially from yourself.',
    'Taking a break is not weakness. It\'s wisdom.',
    'Your mental health matters. You matter.',
    'It\'s okay to not be okay. But it\'s also okay to ask for help.',
    'Progress is progress, no matter how small.',
    'You have already survived 100% of your worst days.',
    'Healing is not linear. That\'s completely normal.',
    'The world needs what only you can offer.',
  ];

  const [currentMessage, setCurrentMessage] = useState(
    hopeMessages[Math.floor(Math.random() * hopeMessages.length)]
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Emotional Care</h1>
          <p className="text-gray-600">Take a moment to check in with yourself. We're here for you.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <section className="bg-white rounded-2xl p-8 shadow-soft mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How are you feeling right now?</h2>
              <p className="text-gray-600 mb-6">Select your current mood. There's no judgment here.</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {moods.map(mood => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`p-4 rounded-2xl transition-all duration-200 transform hover:scale-105 ${
                      selectedMood === mood.id
                        ? `bg-gradient-to-br ${mood.color} text-white shadow-softLg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-3xl mb-2">{mood.icon}</div>
                    <div className="text-xs font-semibold">{mood.label}</div>
                  </button>
                ))}
              </div>
              {selectedMood && (
                <div className="mt-6 p-4 bg-mint-50 rounded-lg border border-mint-200">
                  <p className="text-mint-800">
                    Thank you for sharing. Your feelings are valid. Let's take care of you.
                  </p>
                </div>
              )}
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-6 h-6 text-mint-600" />
                <h2 className="text-2xl font-bold text-gray-900">AI Comfort Companion</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-mint-50 rounded-2xl p-6 border border-mint-200">
                  <p className="text-gray-800 mb-4">
                    {selectedMood
                      ? `I see you're feeling ${moods.find(m => m.id === selectedMood)?.label.toLowerCase()}. That's completely okay. `
                      : "Hi there! I'm here to listen and support you. "}
                    Whatever you're experiencing right now is valid, and you don't have to face it alone.
                  </p>
                  <p className="text-gray-700">
                    Would you like to try one of our quick reset activities, or would you prefer to journal your thoughts?
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {['Try an activity', 'Start journaling', 'Talk to someone'].map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => alert(action)}
                      className="px-4 py-2 rounded-lg bg-sky-100 text-sky-700 font-medium hover:bg-sky-200 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div>
            <div className="bg-gradient-to-br from-mint-400 to-sky-400 rounded-2xl p-8 text-white sticky top-24">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 fill-white" />
                Today's Message
              </h3>
              <p className="text-sm mb-6 leading-relaxed">"{currentMessage}"</p>
              <button
                onClick={() => setCurrentMessage(hopeMessages[Math.floor(Math.random() * hopeMessages.length)])}
                className="w-full px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors font-medium text-sm"
              >
                New message
              </button>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">2-Minute Reset Activities</h2>
          <p className="text-gray-600 mb-8">Choose one to feel better right now. You have the time.</p>

          {activeActivity ? (
            <div className="bg-white rounded-2xl p-8 shadow-soft animate-slideUp max-w-3xl mx-auto">
              {resetActivities.map(activity => {
                if (activity.id !== activeActivity) return null;
                const ActivityIcon = activity.icon;
                return (
                  <div key={activity.id}>
                    <button
                      onClick={() => setActiveActivity(null)}
                      className="text-mint-600 font-medium hover:text-mint-700 mb-6"
                    >
                      ← Back to activities
                    </button>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-mint-100 to-sky-100">
                        <ActivityIcon className="w-8 h-8 text-mint-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{activity.title}</h3>
                        <p className="text-gray-600">{activity.duration}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-8">{activity.description}</p>

                    <div className="space-y-4 mb-8">
                      <h4 className="font-semibold text-gray-900">Instructions:</h4>
                      {activity.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-mint-500 text-white flex items-center justify-center font-semibold flex-shrink-0">
                            {idx + 1}
                          </div>
                          <p className="text-gray-700 pt-1">{step}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => alert('Starting activity...')}
                      className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all"
                    >
                      Start Activity
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {resetActivities.map(activity => {
                const ActivityIcon = activity.icon;
                return (
                  <button
                    key={activity.id}
                    onClick={() => setActiveActivity(activity.id)}
                    className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-softLg transition-all duration-300 text-left group cursor-pointer"
                  >
                    <div className="p-3 rounded-lg bg-gradient-to-br from-mint-100 to-sky-100 mb-4 group-hover:scale-110 transition-transform">
                      <ActivityIcon className="w-6 h-6 text-mint-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-mint-600 transition-colors">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{activity.description}</p>
                    <p className="text-xs text-gray-500">⏱ {activity.duration}</p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-16 bg-gradient-to-r from-sky-50 to-mint-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why These Activities Work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Breathing',
                description: 'Activates your parasympathetic nervous system, bringing you back to calm.',
              },
              {
                title: 'Grounding',
                description: 'Anchors you to the present moment and away from anxious thoughts.',
              },
              {
                title: 'Relaxation',
                description: 'Releases physical tension that often accompanies emotional stress.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}