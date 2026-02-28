import { Activity, AlertCircle, Brain, Heart, Shield, Smile, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-mint-50 via-sky-50 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          {userProfile?.name && (
            <p className="text-lg text-mint-600 font-semibold mb-4 animate-slideUp">Welcome back, {userProfile.name}! 👋</p>
          )}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-slideUp">
            Your mental wellbeing <span className="bg-gradient-to-r from-mint-600 to-sky-600 bg-clip-text text-transparent">matters.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slideUp">
            A safe space to check in with yourself, understand your emotions, and take gentle steps forward. You're never alone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp">
            <Link
              to="/screening"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-mint-600 text-white font-semibold hover:shadow-softLg transition-all duration-200 hover:scale-105"
            >
              Take Screening
            </Link>
            <Link
              to="/emotional-care"
              className="px-8 py-3 rounded-lg bg-sky-100 text-sky-700 font-semibold hover:bg-sky-200 transition-all duration-200"
            >
              Start Emotional Check-In
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-lg bg-mint-100 text-mint-700 font-semibold hover:bg-mint-200 transition-all duration-200"
            >
              Sign In / Sign Up
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How MindScan+ Helps You</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'Understand Yourself',
                description: 'Get deeper insights into your emotional patterns and stress levels with gentle assessments.',
              },
              {
                icon: Heart,
                title: 'Feel Supported',
                description: 'Access a compassionate community, real-time support tools, and grounding exercises.',
              },
              {
                icon: TrendingUp,
                title: 'Track Progress',
                description: 'Visualize your wellness journey with mood tracking, wins, and personal growth metrics.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-mint-50 border border-mint-100 hover:shadow-softLg transition-all duration-300 group cursor-pointer"
              >
                <feature.icon className="w-12 h-12 text-mint-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Understanding Your Stress</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Everyone experiences stress differently. Here are the three stages to help you recognize where you are.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                stage: 'Alarm',
                icon: AlertCircle,
                color: 'from-orange-400 to-red-400',
                bgColor: 'bg-orange-50',
                description: 'Initial stress response. You notice something is wrong. Physical signs: increased heart rate, tension.',
                signs: ['Sudden worry', 'Racing thoughts', 'Tight shoulders', 'Quick breathing'],
              },
              {
                stage: 'Resistance',
                icon: Shield,
                color: 'from-amber-400 to-orange-400',
                bgColor: 'bg-amber-50',
                description: 'You\'re adapting to stress. Your body is working hard to cope but may feel tired.',
                signs: ['Persistent fatigue', 'Difficulty concentrating', 'Mood changes', 'Sleep issues'],
              },
              {
                stage: 'Exhaustion',
                icon: Activity,
                color: 'from-red-400 to-rose-400',
                bgColor: 'bg-red-50',
                description: 'Prolonged stress without relief. This is when you might feel burned out or overwhelmed.',
                signs: ['Chronic fatigue', 'Emotional numbness', 'Loss of motivation', 'Cynicism'],
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl ${item.bgColor} border border-gray-200 hover:shadow-softLg transition-all duration-300`}
              >
                <div className={`inline-block p-3 rounded-lg bg-gradient-to-br ${item.color} mb-4`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.stage}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <div className="space-y-1">
                  {item.signs.map((sign, i) => (
                    <p key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      {sign}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-sky-50 to-mint-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Stories of Hope</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Alex',
                story: 'Using MindScan+ helped me recognize my stress patterns early. Now I address issues before they overwhelm me.',
                timeframe: '3 months in',
              },
              {
                name: 'Jordan',
                story: 'The community support made me feel less alone. Knowing others were going through similar struggles was incredibly validating.',
                timeframe: '2 months in',
              },
              {
                name: 'Casey',
                story: 'The self-care tools are simple but effective. I\'ve created better habits and my mood has significantly improved.',
                timeframe: '4 months in',
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-mint-100 hover:shadow-softLg transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Smile key={i} className="w-4 h-4 text-mint-500 fill-mint-500" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.story}"</p>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.timeframe}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Check In With Yourself?</h2>
          <p className="text-gray-600 mb-8">
            Start your mental wellness journey today. It only takes a few minutes to understand yourself better.
          </p>
          <Link
            to="/screening"
            className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all duration-200 hover:scale-105"
          >
            Begin Now
          </Link>
        </div>
      </section>
    </div>
  );
}