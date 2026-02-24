import { Heart, MessageCircle, Shield, Users } from 'lucide-react';

export default function Community() {
  const stories = [
    {
      id: 1,
      excerpt: 'I thought I was the only one experiencing this level of anxiety. Reading others\' stories helped me realize I\'m not alone.',
      author: 'Anonymous',
      timeAgo: '2 days ago',
      reactions: 234,
      comments: 45,
    },
    {
      id: 2,
      excerpt: 'My mental health journey has been messy and non-linear, but this community reminded me that\'s completely normal and valid.',
      author: 'Anonymous',
      timeAgo: '1 week ago',
      reactions: 567,
      comments: 89,
    },
    {
      id: 3,
      excerpt: 'After years of struggling alone, sharing my story here was liberating. The responses were so compassionate and understanding.',
      author: 'Anonymous',
      timeAgo: '3 days ago',
      reactions: 412,
      comments: 67,
    },
    {
      id: 4,
      excerpt: 'I\'ve learned more about my own mental health from this community than anywhere else. Thank you for this safe space.',
      author: 'Anonymous',
      timeAgo: '1 week ago',
      reactions: 678,
      comments: 102,
    },
    {
      id: 5,
      excerpt: 'The shame I felt started to disappear when I realized how many people share similar struggles. We\'re all in this together.',
      author: 'Anonymous',
      timeAgo: '4 days ago',
      reactions: 892,
      comments: 156,
    },
    {
      id: 6,
      excerpt: 'I came here at my lowest point. The encouragement and practical advice I received changed my perspective on recovery.',
      author: 'Anonymous',
      timeAgo: '2 weeks ago',
      reactions: 1024,
      comments: 198,
    },
  ];

  const supportResources = [
    {
      icon: Users,
      title: 'Peer Support Groups',
      description: 'Join groups based on your interests and challenges',
    },
    {
      icon: MessageCircle,
      title: 'Discussion Forums',
      description: 'Connect with others, ask questions, and share experiences',
    },
    {
      icon: Heart,
      title: 'Buddy System',
      description: 'Get matched with someone going through similar experiences',
    },
    {
      icon: Shield,
      title: 'Safe Space Guidelines',
      description: 'All interactions are respectful, anonymous, and moderated',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">You Are Not Alone</h1>
          <p className="text-gray-600 max-w-2xl">
            Our community is a safe, anonymous space where real people share real stories. Stigma thrives in silence. Connection happens here.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {supportResources.map((resource, idx) => {
            const Icon = resource.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-softLg transition-all">
                <Icon className="w-8 h-8 text-mint-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </div>
            );
          })}
        </div>

        <section className="mb-12">
          <div className="bg-gradient-to-r from-mint-50 to-sky-50 rounded-2xl p-8 border border-mint-200 mb-8">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-mint-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Emotional Safety First</h3>
                <p className="text-gray-700">
                  Every story shared here is treated with care. Our community operates under strict guidelines of respect, compassion, and confidentiality.
                  All members are verified, and any harmful behavior is addressed immediately.
                </p>
                <p className="text-gray-700 mt-3">
                  <strong>Your privacy is protected:</strong> All stories are posted anonymously. Your identity is safe with us.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Community Stories</h2>
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all">
              Share Your Story
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {stories.map(story => (
              <div
                key={story.id}
                className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-softLg transition-all duration-300 cursor-pointer group"
              >
                <p className="text-gray-700 mb-4 line-clamp-3">"{story.excerpt}"</p>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                  <span>{story.author} • {story.timeAgo}</span>
                </div>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-mint-600 transition-colors group-hover:translate-x-0.5">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">{story.reactions}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors group-hover:translate-x-0.5">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">{story.comments}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="px-8 py-3 rounded-lg border-2 border-mint-500 text-mint-600 font-semibold hover:bg-mint-50 transition-colors">
              Load More Stories
            </button>
          </div>
        </section>

        <section className="mt-16 bg-gradient-to-r from-sky-50 to-mint-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Be Kind',
                description: 'Treat others as you would like to be treated. Compassion is our core value.',
              },
              {
                title: 'Respect Privacy',
                description: 'All stories are anonymous. Never try to identify or contact community members.',
              },
              {
                title: 'Stay On Topic',
                description: 'Keep conversations focused on mental health and emotional wellbeing.',
              },
              {
                title: 'No Judgment',
                description: 'Mental health struggles look different for everyone. All experiences are valid.',
              },
              {
                title: 'Crisis Support',
                description: 'If someone shares they\'re in crisis, encourage them to reach out for professional help.',
              },
              {
                title: 'Moderation',
                description: 'Our team moderates 24/7 to ensure a safe environment for everyone.',
              },
            ].map((guideline, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{guideline.title}</h3>
                <p className="text-gray-600 text-sm">{guideline.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 bg-white rounded-2xl p-8 shadow-soft text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">New to the Community?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Start by reading stories from others. When you're ready, share your own. There's no judgment here—only support and understanding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">
              Explore Stories
            </button>
            <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all">
              Share Your Story
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}