import { CheckCircle, Heart, Leaf, MessageCircle, Play, RefreshCw, Wind } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function EmotionalCare() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  // Ref to current step so the timer interval can always read the latest value
  const stepRef = useRef(0);
  const [activityStarted, setActivityStarted] = useState(false);
  const [activityCompleted, setActivityCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const activeActivityRef = useRef<string | null>(null);

  const moods = [
    { 
      id: 'happy', 
      label: 'Happy', 
      icon: '😊', 
      color: 'from-yellow-400 to-orange-400',
      responses: [
        "That's wonderful! Let's keep this positive momentum going.",
        "Your happiness is contagious! Keep spreading that joy.",
        "Celebrate this moment. You deserve to feel good!"
      ],
      suggestedActivity: 'relaxation'
    },
    { 
      id: 'calm', 
      label: 'Calm', 
      icon: '😌', 
      color: 'from-green-400 to-mint-400',
      responses: [
        "That's beautiful. Let's help you maintain this peaceful state.",
        "You're in a good place right now. Let's keep it that way.",
        "Calmness is a gift. Nurture it with these activities."
      ],
      suggestedActivity: 'grounding'
    },
    { 
      id: 'anxious', 
      label: 'Anxious', 
      icon: '😰', 
      color: 'from-blue-400 to-sky-400',
      responses: [
        "Anxiety is your mind trying to protect you. Let's calm it down.",
        "You're safe right now. Let's ease this feeling together.",
        "Anxiety is temporary. These techniques will help you through it."
      ],
      suggestedActivity: 'breathing'
    },
    { 
      id: 'sad', 
      label: 'Sad', 
      icon: '😢', 
      color: 'from-indigo-400 to-purple-400',
      responses: [
        "It's okay to feel sad. Your emotions are valid and important.",
        "Sadness is part of being human. You're not alone in this.",
        "This feeling will pass. Let's take gentle care of you right now."
      ],
      suggestedActivity: 'grounding'
    },
    { 
      id: 'exhausted', 
      label: 'Exhausted', 
      icon: '😴', 
      color: 'from-gray-400 to-slate-400',
      responses: [
        "You're tired, and that's okay. You need rest.",
        "Exhaustion is your body asking for help. Let's listen to it.",
        "Sometimes we all need to slow down. This is that time for you."
      ],
      suggestedActivity: 'relaxation'
    },
  ];

  const resetActivities = [
    {
      id: 'breathing',
      title: '4-7-8 Breathing',
      icon: Wind,
      description: 'A scientifically-backed breathing technique to calm your nervous system',
      duration: 120,
      steps: [
        { instruction: 'Find a comfortable position where you can sit or lie down', duration: 5, detail: 'Take 5 seconds to settle' },
        { instruction: 'Breathe in slowly through your nose for 4 counts', duration: 4, detail: 'In... 2... 3... 4...' },
        { instruction: 'Hold your breath for 7 counts', duration: 7, detail: 'Hold... 2... 3... 4... 5... 6... 7...' },
        { instruction: 'Exhale slowly through your mouth for 8 counts', duration: 8, detail: 'Out... 2... 3... 4... 5... 6... 7... 8...' },
        { instruction: 'Repeat steps 2-4 for a total of 4 cycles', duration: 76, detail: 'You\'re doing great! Continue the pattern' },
        { instruction: 'Take a moment to notice how you feel', duration: 10, detail: 'Feel the calm settling in' },
      ],
      benefits: ['Activates your parasympathetic nervous system', 'Slows your heart rate', 'Reduces anxiety immediately'],
    },
    {
      id: 'grounding',
      title: '5-4-3-2-1 Grounding',
      icon: Leaf,
      description: 'Use your senses to bring yourself back to the present moment',
      duration: 120,
      steps: [
        { instruction: 'Look around and name 5 things you can see', duration: 20, detail: 'Colors, textures, objects - anything visible' },
        { instruction: 'Notice 4 things you can touch', duration: 20, detail: 'Feel the temperature and texture. Touch them if you can.' },
        { instruction: 'Listen for 3 things you can hear', duration: 20, detail: 'Sounds far and near - birds, wind, voices, silence' },
        { instruction: 'Identify 2 things you can smell', duration: 20, detail: 'Fresh air, coffee, nature - whatever is around you' },
        { instruction: 'Focus on 1 thing you can taste', duration: 20, detail: 'The taste in your mouth right now - whatever it is' },
        { instruction: 'Take a deep breath and feel grounded', duration: 20, detail: 'You\'re here, you\'re safe, you\'re present' },
      ],
      benefits: ['Anchors you to the present moment', 'Interrupts anxious thoughts', 'Engages all five senses'],
    },
    {
      id: 'relaxation',
      title: 'Progressive Relaxation',
      icon: RefreshCw,
      description: 'Release tension from your body systematically',
      duration: 120,
      steps: [
        { instruction: 'Get comfortable and take 3 deep breaths', duration: 10, detail: 'Prepare your body for relaxation' },
        { instruction: 'Tense your feet for 5 seconds, then release', duration: 15, detail: 'Feel the difference between tension and relaxation' },
        { instruction: 'Tense your legs, hold, then release', duration: 15, detail: 'Let the tension flow away' },
        { instruction: 'Tense your stomach and lower back, then release', duration: 15, detail: 'Feel your core relax' },
        { instruction: 'Tense your chest and arms, then release', duration: 15, detail: 'Breathe into the relaxation' },
        { instruction: 'Tense your hands into fists, then release', duration: 10, detail: 'Open your hands and feel the ease' },
        { instruction: 'Tense your neck and shoulders, then release', duration: 15, detail: 'Let go of that tension you carry' },
        { instruction: 'Tense your face, then release and smile', duration: 15, detail: 'End with a gentle, relaxed expression' },
        { instruction: 'Notice your completely relaxed body', duration: 10, detail: 'You\'ve released the tension. Well done!' },
      ],
      benefits: ['Releases physical tension', 'Improves body awareness', 'Promotes deep relaxation'],
    },
  ];

  // Keep refs in sync with state for use inside the timer interval
  useEffect(() => { stepRef.current = currentStep; }, [currentStep]);
  useEffect(() => { activeActivityRef.current = activeActivity; }, [activeActivity]);

  // Timer effect - reads from refs to avoid stale closures
  useEffect(() => {
    if (!activityStarted || activityCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          const act = resetActivities.find(a => a.id === activeActivityRef.current);
          if (!act) return 0;
          const step = stepRef.current;
          if (step < act.steps.length - 1) {
            const nextStep = step + 1;
            setCurrentStep(nextStep);
            return act.steps[nextStep].duration;
          } else {
            setActivityCompleted(true);
            clearInterval(timer);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activityStarted, activityCompleted]);

  const getActiveActivity = () => {
    return resetActivities.find(a => a.id === activeActivity);
  };

  const startActivity = () => {
    const activity = getActiveActivity();
    if (activity) {
      setActivityStarted(true);
      setCurrentStep(0);
      stepRef.current = 0;
      setTimeLeft(activity.steps[0].duration);
    }
  };

  const nextStep = () => {
    const activity = getActiveActivity();
    if (activity && currentStep < activity.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimeLeft(activity.steps[currentStep + 1].duration);
    }
  };

  const finishActivity = () => {
    setActiveActivity(null);
    activeActivityRef.current = null;
    setActivityStarted(false);
    setActivityCompleted(false);
    setCurrentStep(0);
    stepRef.current = 0;
    setTimeLeft(0);
  };

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

  const selectedMoodData = moods.find(m => m.id === selectedMood);
  const dynamicResponse = selectedMoodData 
    ? selectedMoodData.responses[Math.floor(Math.random() * selectedMoodData.responses.length)]
    : "Hi there! I'm here to listen and support you.";

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Emotional Care</h1>
          <p className="text-gray-600">Take a moment to check in with yourself. We're here for you.</p>
        </div>

        {!activeActivity ? (
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <section className="bg-white rounded-2xl p-8 shadow-soft mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How are you feeling right now?</h2>
                <p className="text-gray-600 mb-6">Select your current mood. There's no judgment here.</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {moods.map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => {
                        setSelectedMood(mood.id);
                      }}
                      className={`p-4 rounded-2xl transition-all duration-200 transform hover:scale-105 ${
                        selectedMood === mood.id
                          ? `bg-gradient-to-br ${mood.color} text-white shadow-softLg scale-105`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-3xl mb-2">{mood.icon}</div>
                      <div className="text-xs font-semibold">{mood.label}</div>
                    </button>
                  ))}
                </div>
                {selectedMood && (
                  <div className="mt-6 p-4 bg-mint-50 rounded-lg border border-mint-200 animate-fadeIn">
                    <p className="text-mint-800 font-medium">
                      ✓ {selectedMoodData?.label} - Got it. Let's take care of you.
                    </p>
                  </div>
                )}
              </section>

              <section className="bg-white rounded-2xl p-8 shadow-soft">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="w-6 h-6 text-mint-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Your Support Companion</h2>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-mint-50 to-sky-50 rounded-2xl p-6 border border-mint-200">
                    <p className="text-gray-800 mb-4 font-medium">
                      {dynamicResponse}
                    </p>
                    <p className="text-gray-700">
                      {selectedMood 
                        ? `Based on how you're feeling, I'd love to help you try one of our interactive activities. They're quick, guided, and designed just for moments like this.`
                        : "Pick one of the emotions above, and I'll suggest some activities that match how you're feeling."}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {selectedMood && (
                      <button
                        disabled={!selectedMood}
                        onClick={() => setActiveActivity(selectedMoodData?.suggestedActivity || 'breathing')}
                        className="px-4 py-2 rounded-lg bg-mint-500 text-white font-medium hover:bg-mint-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Try Recommended Activity →
                      </button>
                    )}
                    <Link
                      to="/self-care"
                      className="px-4 py-2 rounded-lg bg-sky-100 text-sky-700 font-medium hover:bg-sky-200 transition-colors"
                    >
                      Journal Instead
                    </Link>
                    <Link
                      to="/resources"
                      className="px-4 py-2 rounded-lg bg-sky-100 text-sky-700 font-medium hover:bg-sky-200 transition-colors"
                    >
                      Professional Help
                    </Link>
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
        ) : null}

        {activeActivity && !activityStarted && !activityCompleted ? (
          <section className="bg-white rounded-2xl p-8 shadow-soft animate-slideUp max-w-3xl mx-auto">
            <button
              onClick={() => setActiveActivity(null)}
              className="text-mint-600 font-medium hover:text-mint-700 mb-6 flex items-center gap-1"
            >
              ← Back
            </button>
            {getActiveActivity() && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-mint-100 to-sky-100">
                    {(() => {
                      const ActivityIcon = getActiveActivity()!.icon;
                      return <ActivityIcon className="w-8 h-8 text-mint-600" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{getActiveActivity()?.title}</h3>
                    <p className="text-gray-600">≈ 2 minutes</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-8">{getActiveActivity()?.description}</p>

                <div className="bg-sky-50 border border-sky-200 rounded-lg p-6 mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4">How it works:</h4>
                  <ul className="space-y-2 text-gray-700">
                    {getActiveActivity()?.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="font-semibold text-sky-600">{idx + 1}.</span>
                        <span>{step.instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {getActiveActivity()?.benefits.map((benefit, idx) => (
                    <div key={idx} className="bg-mint-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-mint-900">✓ {benefit}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={startActivity}
                  className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all flex items-center justify-center gap-2 group"
                >
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Start Activity
                </button>
              </div>
            )}
          </section>
        ) : activeActivity && activityStarted && !activityCompleted ? (
          <section className="bg-white rounded-2xl p-8 shadow-soft animate-slideUp max-w-3xl mx-auto">
            {getActiveActivity() && (
              <div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{getActiveActivity()?.title}</h3>
                  <div className="text-5xl font-bold text-mint-600 mb-4">{timeLeft}s</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-mint-500 to-sky-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((currentStep + 1) / getActiveActivity()!.steps.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Step {currentStep + 1} of {getActiveActivity()?.steps.length}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="bg-gradient-to-br from-mint-50 to-sky-50 rounded-2xl p-8 border-2 border-mint-200">
                    <p className="text-center text-xl text-gray-900 font-semibold mb-4">
                      {getActiveActivity()?.steps[currentStep].instruction}
                    </p>
                    <p className="text-center text-gray-600 text-lg">
                      {getActiveActivity()?.steps[currentStep].detail}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setActivityStarted(false);
                      setCurrentStep(0);
                      setTimeLeft(0);
                    }}
                    className="flex-1 px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Pause
                  </button>
                  {currentStep < getActiveActivity()!.steps.length - 1 && (
                    <button
                      onClick={nextStep}
                      className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all"
                    >
                      Next Step
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        ) : activeActivity && activityCompleted ? (
          <section className="bg-white rounded-2xl p-8 shadow-soft animate-slideUp max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-mint-400 to-sky-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Awesome! You Did It!</h3>
              <p className="text-gray-600 mb-2">You completed {getActiveActivity()?.title}</p>
              <p className="text-gray-700 mb-8 text-lg">
                Notice how you feel now. You took care of yourself. That matters.
              </p>

              <div className="bg-gradient-to-r from-mint-50 to-sky-50 rounded-lg p-6 mb-8 border border-mint-200">
                <p className="text-gray-700 mb-2">💡 <span className="font-semibold">Did you know?</span></p>
                <p className="text-sm text-gray-600">
                  Regular practice of these activities can significantly reduce anxiety and improve emotional well-being over time.
                </p>
              </div>

              <div className="flex gap-4 flex-col sm:flex-row">
                <button
                  onClick={finishActivity}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all"
                >
                  Try Another Activity
                </button>
                <Link
                  to="/self-care"
                  className="flex-1 px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors text-center"
                >
                  Journal About This
                </Link>
              </div>
            </div>
          </section>
        ) : !activeActivity ? (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">2-Minute Reset Activities</h2>
            <p className="text-gray-600 mb-8">Choose one to feel better right now. You have the time.</p>

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
                    <p className="text-xs text-gray-500">⏱ 2 minutes</p>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

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