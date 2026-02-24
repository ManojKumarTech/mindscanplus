import { Phone, Globe, BookOpen, Music, Users, Heart, AlertTriangle } from 'lucide-react';

export default function Resources() {
  const emergencyResources = [
    {
      name: 'National Crisis Hotline',
      phone: '988 (Call or Text)',
      description: 'Available 24/7 for immediate support during emotional distress',
      icon: Phone,
    },
    {
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      description: 'Text-based crisis support whenever you need it',
      icon: Phone,
    },
    {
      name: 'International Helpline',
      phone: 'findahelpline.com',
      description: 'Find mental health support resources worldwide',
      icon: Globe,
    },
  ];

  const articles = [
    {
      title: 'Understanding Your Stress Cycle',
      category: 'Education',
      readTime: '5 min',
      excerpt: 'Learn about the three stages of stress and how to recognize when you need support.',
    },
    {
      title: 'Building Resilience: A Step-by-Step Guide',
      category: 'Wellness',
      readTime: '8 min',
      excerpt: 'Discover practical techniques to strengthen your emotional resilience.',
    },
    {
      title: 'The Science Behind Breathing Exercises',
      category: 'Research',
      readTime: '6 min',
      excerpt: 'Understand how simple breathing techniques can calm your nervous system.',
    },
    {
      title: 'Cultivating Self-Compassion',
      category: 'Wellness',
      readTime: '7 min',
      excerpt: 'Learn to speak to yourself with the same kindness you offer others.',
    },
    {
      title: 'Sleep and Mental Health: The Connection',
      category: 'Health',
      readTime: '6 min',
      excerpt: 'Explore how sleep quality impacts your emotional wellbeing.',
    },
    {
      title: 'Breaking the Stigma Around Mental Health',
      category: 'Community',
      readTime: '9 min',
      excerpt: 'Why mental health deserves the same attention as physical health.',
    },
  ];

  const audioGuides = [
    {
      title: '5-Minute Morning Meditation',
      duration: '5:23',
      category: 'Meditation',
      icon: '🧘',
    },
    {
      title: 'Guided Body Scan for Relaxation',
      duration: '12:45',
      category: 'Relaxation',
      icon: '✨',
    },
    {
      title: 'Sleep Story: The Forest Path',
      duration: '25:00',
      category: 'Sleep',
      icon: '🌲',
    },
    {
      title: 'Anxiety Release Meditation',
      duration: '10:15',
      category: 'Anxiety',
      icon: '🌊',
    },
    {
      title: 'Loving-Kindness Meditation',
      duration: '8:30',
      category: 'Self-Compassion',
      icon: '💖',
    },
    {
      title: 'Grounding Technique Walkthrough',
      duration: '6:40',
      category: 'Grounding',
      icon: '🌿',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Resources & Support</h1>
          <p className="text-gray-600">
            Everything you need to understand your mental health and access support when you need it.
          </p>
        </div>

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
            <h2 className="text-2xl font-bold text-gray-900">Immediate Support</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {emergencyResources.map((resource, idx) => {
              const Icon = resource.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-soft border-l-4 border-rose-500 hover:shadow-softLg transition-all"
                >
                  <Icon className="w-8 h-8 text-rose-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">{resource.name}</h3>
                  <p className="text-lg font-semibold text-rose-600 mb-2">{resource.phone}</p>
                  <p className="text-gray-600 text-sm">{resource.description}</p>
                  <button className="mt-4 w-full px-4 py-2 rounded-lg bg-rose-50 text-rose-600 font-medium hover:bg-rose-100 transition-colors">
                    Get Help
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-sky-50 to-mint-50 rounded-2xl p-8 border border-sky-200">
          <div className="flex items-start gap-4">
            <Heart className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">In Crisis?</h3>
              <p className="text-gray-700 mb-4">
                If you're thinking about harming yourself or others, please reach out for immediate help. You deserve support, and there are people
                ready to listen.
              </p>
              <button className="px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors">
                Find Crisis Services Near You
              </button>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Educational Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {articles.map((article, idx) => (
              <article
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-softLg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-mint-100 text-mint-700">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-mint-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                <button className="text-mint-600 font-semibold text-sm hover:text-mint-700 transition-colors">
                  Read Article →
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Guided Audio Resources</h2>
          <p className="text-gray-600 mb-8">
            Calming meditations and guided exercises to support your emotional wellness.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {audioGuides.map((guide, idx) => (
              <button
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-softLg transition-all text-left group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{guide.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{guide.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold bg-sky-100 text-sky-700 px-2 py-1 rounded">
                    {guide.category}
                  </span>
                  <span className="text-xs text-gray-500">{guide.duration}</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-mint-600 font-medium">
                  <Music className="w-4 h-4" />
                  Listen Now
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Support</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Therapist Directory',
                description: 'Find licensed therapists and counselors in your area or online',
                icon: Users,
                color: 'from-mint-500 to-sky-500',
              },
              {
                title: 'Psychiatrist Services',
                description: 'Access psychiatric evaluation and medication management',
                icon: BookOpen,
                color: 'from-sky-500 to-blue-500',
              },
            ].map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-softLg transition-all">
                  <div className={`inline-block p-3 rounded-lg bg-gradient-to-br ${service.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-700">✓ Verified professionals</p>
                    <p className="text-sm text-gray-700">✓ Flexible scheduling</p>
                    <p className="text-sm text-gray-700">✓ Insurance accepted</p>
                  </div>
                  <button className="w-full px-6 py-3 rounded-lg bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition-colors">
                    Find a Professional
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-gradient-to-r from-mint-100 to-sky-100 rounded-2xl p-8 border border-mint-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Mental Health Matters</h2>
          <p className="text-gray-800 max-w-2xl mx-auto mb-6">
            Seeking help is a sign of strength, not weakness. Whether you need immediate support, educational resources, or professional care, we're
            here to help you every step of the way.
          </p>
          <p className="text-gray-800 font-semibold mb-6">
            If you're ready to take the next step, reach out to a professional today.
          </p>
          <button className="px-8 py-3 rounded-lg bg-white text-mint-600 font-semibold hover:bg-gray-100 transition-colors">
            Get Started Today
          </button>
        </section>
      </div>
    </div>
  );
}