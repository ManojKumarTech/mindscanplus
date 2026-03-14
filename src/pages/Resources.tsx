import {
  BookOpen,
  ExternalLink,
  Globe,
  Heart,
  Music,
  Phone,
  PlayCircle,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  articles,
  audioGuides,
  helplines,
  professionalServices,
} from '../services/resourcesData';

// ──────────────────────────────────────────────────────────────────────────────

export default function Resources() {
  const [activeEmbed, setActiveEmbed] = useState<string | null>(null);
  const [articleFilter, setArticleFilter] = useState<string>('All');

  const articleCategories = ['All', ...Array.from(new Set(articles.map((a) => a.category)))];
  const filteredArticles =
    articleFilter === 'All' ? articles : articles.filter((a) => a.category === articleFilter);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Resources &amp; Support</h1>
          <p className="text-gray-600 max-w-2xl">
            Verified Indian helplines, educational articles, embedded relaxation music, and
            professional support — everything you need on your wellbeing journey.
          </p>
        </div>

        {/* ── Crisis Banner ── */}
        <section className="mb-10 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-rose-200 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-rose-100 rounded-xl flex-shrink-0">
            <Heart className="w-6 h-6 text-rose-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">In Crisis Right Now?</h3>
            <p className="text-gray-700 text-sm">
              If you're in immediate distress or thinking of harming yourself, please call{' '}
              <span className="font-bold text-rose-600">iCall: 9152987821</span> or{' '}
              <span className="font-bold text-rose-600">Tele MANAS: 14416</span>. Help is
              available 24&times;7, free of charge.
            </p>
          </div>
          <a
            href="tel:14416"
            className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors text-sm"
          >
            Call 14416 Now
          </a>
        </section>

        {/* ── Helplines ── */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="w-5 h-5 text-rose-600" />
            <h2 className="text-2xl font-bold text-gray-900">Immediate Support (India)</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {helplines.map((h, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-soft border-l-4 border-rose-500 hover:shadow-softLg transition-all flex flex-col"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug">{h.name}</h3>
                  {h.badge && (
                    <span className="ml-2 flex-shrink-0 text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full">
                      {h.badge}
                    </span>
                  )}
                </div>
                {h.phone ? (
                  <a
                    href={`tel:${h.phone}`}
                    className="text-xl font-bold text-rose-600 hover:text-rose-700 mb-1 transition-colors"
                  >
                    {h.phoneDisplay}
                  </a>
                ) : (
                  <p className="text-lg font-semibold text-rose-600 mb-1">{h.phoneDisplay}</p>
                )}
                <p className="text-xs text-amber-700 font-medium mb-2">🕐 {h.hours}</p>
                <p className="text-gray-600 text-sm flex-1 mb-4">{h.description}</p>
                <a
                  href={h.link}
                  target={h.link.startsWith('http') ? '_blank' : undefined}
                  rel={h.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="mt-auto w-full block text-center px-4 py-2 rounded-lg bg-rose-50 text-rose-600 font-medium hover:bg-rose-100 transition-colors text-sm"
                >
                  {h.linkLabel}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── Educational Articles ── */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-mint-600" />
            <h2 className="text-2xl font-bold text-gray-900">Educational Articles</h2>
          </div>
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {articleCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setArticleFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  articleFilter === cat
                    ? 'bg-mint-500 text-white shadow-soft'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredArticles.map((article, idx) => (
              <article
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-softLg transition-all group flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-mint-100 text-mint-700">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-400">{article.readTime} read</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-mint-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 italic">Source: {article.source}</span>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-mint-600 font-semibold text-sm hover:text-mint-700 transition-colors"
                  >
                    Read Article <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Guided Audio / Embedded Music ── */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-2">
            <Music className="w-5 h-5 text-sky-600" />
            <h2 className="text-2xl font-bold text-gray-900">Guided Audio Resources</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Indian classical and guided meditation music. Click a card to play directly here — or
            open in YouTube.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audioGuides.map((guide) => {
              const isActive = activeEmbed === guide.youtubeId;
              return (
                <div
                  key={guide.youtubeId}
                  className="bg-white rounded-2xl shadow-soft hover:shadow-softLg transition-all overflow-hidden flex flex-col"
                >
                  {/* Embed or Thumbnail */}
                  {isActive ? (
                    <div className="relative" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${guide.youtubeId}?autoplay=1&rel=0`}
                        title={guide.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveEmbed(guide.youtubeId)}
                      className="relative w-full group/thumb"
                      style={{ paddingBottom: '56.25%' }}
                      aria-label={`Play ${guide.title}`}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${guide.youtubeId}/mqdefault.jpg`}
                        alt={guide.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* dark overlay + play icon */}
                      <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/45 transition-colors flex items-center justify-center">
                        <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
                      </div>
                    </button>
                  )}

                  {/* Card body */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{guide.icon}</span>
                      <span className="text-xs font-semibold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                        {guide.category}
                      </span>
                      <span className="ml-auto text-xs text-gray-400">{guide.duration}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{guide.title}</h3>
                    <p className="text-gray-500 text-xs mb-4 flex-1">{guide.description}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveEmbed(isActive ? null : guide.youtubeId)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-mint-500 text-white text-xs font-semibold hover:shadow-softLg transition-all"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        {isActive ? 'Close' : 'Play Here'}
                      </button>
                      <a
                        href={`https://www.youtube.com/watch?v=${guide.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors"
                        title="Open in YouTube"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        YouTube
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Professional Support ── */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Professional Support (India)</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {professionalServices.map((svc, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-7 shadow-soft hover:shadow-softLg transition-all flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${svc.color}`}
                  >
                    {svc.badge}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{svc.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">{svc.description}</p>
                <ul className="space-y-1.5 mb-5">
                  {svc.features.map((f, fi) => (
                    <li key={fi} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-mint-100 text-mint-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={svc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full block text-center px-5 py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r ${svc.color} hover:shadow-softLg transition-all text-sm`}
                >
                  {svc.linkLabel}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── Directory Link ── */}
        <section className="mb-10 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-7 border border-indigo-200 flex flex-col sm:flex-row items-center gap-5">
          <Globe className="w-10 h-10 text-indigo-500 flex-shrink-0" />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-gray-900 mb-1">Need More Local Help?</h3>
            <p className="text-gray-600 text-sm">
              The Mind Clan is India's most inclusive therapist and support-group directory — filter
              by city, language, specialisation, and budget.
            </p>
          </div>
          <a
            href="https://themindclan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors text-sm"
          >
            Browse Directory
          </a>
        </section>

        {/* ── Footer CTA ── */}
        <section className="bg-gradient-to-r from-mint-100 to-sky-100 rounded-2xl p-8 border border-mint-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Mental Health Matters 🇮🇳</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6 text-sm">
            Seeking help is a sign of strength, not weakness. Whether you need a helpline, an
            article to understand what you're feeling, calming music, or a professional — we're
            here to help every step of the way.
          </p>
          <Link
            to="/screening"
            className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all"
          >
            Take a Screening Now
          </Link>
        </section>

      </div>
    </div>
  );
}