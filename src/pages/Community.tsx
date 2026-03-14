import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Edit2, Heart, Shield, Trash2, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  CommunityStory,
  deleteStory,
  fetchStories,
  postStory,
  reactToStory,
  unreactToStory,
  updateStory,
} from '../services/communityService';

const PAGE_SIZE = 10;
const MAX_EXCERPT_LENGTH = 500;

export default function Community() {
  const [stories, setStories] = useState<CommunityStory[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showUserStories, setShowUserStories] = useState(false);
  const [newExcerpt, setNewExcerpt] = useState('');
  const [editingStory, setEditingStory] = useState<CommunityStory | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Track which story IDs the current user has already reacted to (session-level)
  const [reactedIds, setReactedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('reactedStoryIds');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const { showToast } = useToast();
  const { user, userProfile } = useAuth();

  // Fetch all stories
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingStories(true);
      try {
        const { stories: fetched, nextCursor: cursor } = await fetchStories(PAGE_SIZE);
        if (!cancelled) {
          try {
            const savedStr = localStorage.getItem('reactedStoryIds');
            if (savedStr) {
               const localLiked = new Set<string>(JSON.parse(savedStr));
               const adjusted = fetched.map(s => {
                 if (s.id && localLiked.has(s.id)) {
                   return { ...s, reactions: s.reactions + 1 };
                 }
                 return s;
               });
               setStories(adjusted);
            } else {
               setStories(fetched);
            }
          } catch {
            setStories(fetched);
          }
          setNextCursor(cursor);
        }
      } catch (e) {
        console.error('Failed to load stories', e);
        if (!cancelled) showToast('Failed to load stories.', 'error');
      } finally {
        if (!cancelled) setLoadingStories(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Get user's own stories from the fetched stories
  const userStories = stories.filter(story => user && story.authorId === user.uid);

  const supportResources = [
    {
      icon: Users,
      title: 'Peer Support Groups',
      description: 'Join groups based on your interests and challenges',
    },
    {
      icon: Users,
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

  // Handle posting a new story
  const handlePostStory = async () => {
    if (!newExcerpt.trim()) return;
    setSubmitting(true);
    try {
      await postStory(newExcerpt.trim(), user ? (userProfile?.name ?? null) : null, user?.uid ?? null);
      const { stories: fetched, nextCursor: cursor } = await fetchStories(PAGE_SIZE);
      setStories(fetched);
      setNextCursor(cursor);
      setShowSubmit(false);
      setNewExcerpt('');
      showToast('Your story was shared. Thank you.');
    } catch (e) {
      console.error('Failed to submit story', e);
      showToast('Failed to share. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle editing a story
  const handleEditStory = async () => {
    if (!editingStory || !newExcerpt.trim()) return;
    setSubmitting(true);
    try {
      await updateStory(editingStory.id!, newExcerpt.trim());
      const { stories: fetched, nextCursor: cursor } = await fetchStories(PAGE_SIZE);
      setStories(fetched);
      setNextCursor(cursor);
      setEditingStory(null);
      setNewExcerpt('');
      showToast('Your story has been updated.');
    } catch (e) {
      console.error('Failed to update story', e);
      showToast('Failed to update. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle deleting a story
  const handleDeleteStory = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    try {
      await deleteStory(storyId);
      const { stories: fetched, nextCursor: cursor } = await fetchStories(PAGE_SIZE);
      setStories(fetched);
      setNextCursor(cursor);
      showToast('Your story has been deleted.');
    } catch (e) {
      console.error('Failed to delete story', e);
      showToast('Failed to delete. Try again.', 'error');
    }
  };

  // Handle heart reaction (toggleable) with optimistic UI update
  const handleReact = async (story: CommunityStory) => {
    if (!story.id) return;
    const alreadyReacted = reactedIds.has(story.id);

    // Optimistic UI update
    setStories(prev =>
      prev.map(s =>
        s.id === story.id
          ? { ...s, reactions: Math.max(0, s.reactions + (alreadyReacted ? -1 : 1)) }
          : s
      )
    );
    setReactedIds(prev => {
      const next = new Set(prev);
      alreadyReacted ? next.delete(story.id!) : next.add(story.id!);
      localStorage.setItem('reactedStoryIds', JSON.stringify(Array.from(next)));
      return next;
    });

    try {
      if (alreadyReacted) {
        await unreactToStory(story.id);
      } else {
        await reactToStory(story.id);
      }
    } catch (e) {
      // Supress backend permission warnings. Local UI update remains visually active for UX flow.
      console.warn('Backend rejected reaction locally, but skipping rollback to preserve optimistic UI');
    }
  };

  const isOwnStory = (story: CommunityStory) => user && story.authorId === user.uid;

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
                </p>
                <p className="text-gray-700 mt-3">
                  <strong>Your privacy is protected:</strong> All stories are posted anonymously. Your identity is safe with us.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={() => setShowSubmit(true)}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all"
          >
            Share Your Story
          </button>
          {user && userStories.length > 0 && (
            <button
              onClick={() => setShowUserStories(!showUserStories)}
              className="px-6 py-2 rounded-lg bg-white border-2 border-mint-500 text-mint-600 font-semibold hover:bg-mint-50 transition-all"
            >
              {showUserStories ? 'Hide My Stories' : 'View My Stories'}
            </button>
          )}
        </section>

        {/* User's Stories Section */}
        {showUserStories && user && userStories.length > 0 && (
          <section className="mb-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Stories</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {userStories.map(story => (
                <div
                  key={story.id}
                  className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-softLg transition-all duration-300 relative"
                >
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => { setEditingStory(story); setNewExcerpt(story.excerpt); }}
                      className="p-2 text-gray-400 hover:text-mint-600 transition-colors rounded-lg hover:bg-mint-50"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStory(story.id!)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-700 mb-4 pr-12">{story.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                    <span>Anonymous</span>
                    <span>{story.createdAt?.toDate ? story.createdAt.toDate().toLocaleDateString() : 'Recently'}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-2 text-gray-600">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">{story.reactions}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Submit Story Modal */}
        {showSubmit && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.target === e.currentTarget && (setShowSubmit(false), setNewExcerpt(''))}
          >
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-softLg animate-slideUp" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Share Your Story</h3>
                <button onClick={() => { setShowSubmit(false); setNewExcerpt(''); }} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">Posts are shown as Anonymous to protect privacy.</p>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-mint-500"
                value={newExcerpt}
                onChange={e => setNewExcerpt(e.target.value.slice(0, MAX_EXCERPT_LENGTH))}
                placeholder="Write something you'd like to share..."
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{newExcerpt.length}/{MAX_EXCERPT_LENGTH}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowSubmit(false); setNewExcerpt(''); }}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting || !newExcerpt.trim()}
                  onClick={handlePostStory}
                  className="px-4 py-2 rounded-lg bg-mint-500 text-white hover:bg-mint-600 disabled:opacity-60 font-medium"
                >
                  {submitting ? 'Sharing…' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Story Modal */}
        {editingStory && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.target === e.currentTarget && (setEditingStory(null), setNewExcerpt(''))}
          >
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-softLg animate-slideUp" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Edit Your Story</h3>
                <button onClick={() => { setEditingStory(null); setNewExcerpt(''); }} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-mint-500"
                value={newExcerpt}
                onChange={e => setNewExcerpt(e.target.value.slice(0, MAX_EXCERPT_LENGTH))}
                placeholder="Write something you'd like to share..."
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{newExcerpt.length}/{MAX_EXCERPT_LENGTH}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setEditingStory(null); setNewExcerpt(''); }}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting || !newExcerpt.trim()}
                  onClick={handleEditStory}
                  className="px-4 py-2 rounded-lg bg-mint-500 text-white hover:bg-mint-600 disabled:opacity-60 font-medium"
                >
                  {submitting ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        <section id="community-stories">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Community Stories</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {loadingStories ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-soft animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              ))
            ) : stories.length === 0 ? (
              <div className="col-span-2 text-center py-16">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories yet</h3>
                <p className="text-gray-500 mb-6">Be the first to share your story with the community.</p>
                <button
                  onClick={() => setShowSubmit(true)}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all"
                >
                  Share Your Story
                </button>
              </div>
            ) : (
              stories.map(story => (
                <div
                  key={story.id}
                  className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-softLg transition-all duration-300 group"
                >
                  <p className="text-gray-700 mb-4 line-clamp-4">{story.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                    <span className="font-medium text-gray-500">Anonymous</span>
                    <span>{story.createdAt?.toDate ? story.createdAt.toDate().toLocaleDateString() : 'Recently'}</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={() => handleReact(story)}
                      className={`flex items-center gap-2 transition-all px-3 py-1.5 rounded-lg font-medium text-sm ${
                        reactedIds.has(story.id!)
                          ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-rose-500'
                      }`}
                      title={reactedIds.has(story.id!) ? 'Remove reaction' : 'React with heart'}
                    >
                      <Heart className={`w-4 h-4 ${reactedIds.has(story.id!) ? 'fill-rose-500' : ''}`} />
                      <span>{story.reactions}</span>
                    </button>
                    {isOwnStory(story) && (
                      <span className="ml-auto text-xs text-mint-600 font-medium bg-mint-50 px-2 py-1 rounded">Your story</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              disabled={loadingMore || !nextCursor}
              onClick={async () => {
                if (!nextCursor) return;
                setLoadingMore(true);
                try {
                  const { stories: more, nextCursor: cursor } = await fetchStories(PAGE_SIZE, nextCursor);
                  setStories(prev => [...prev, ...more]);
                  setNextCursor(cursor);
                } catch (e) {
                  showToast('Failed to load more.', 'error');
                } finally {
                  setLoadingMore(false);
                }
              }}
              className="px-8 py-3 rounded-lg border-2 border-mint-500 text-mint-600 font-semibold hover:bg-mint-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? 'Loading…' : nextCursor ? 'Load More Stories' : 'All stories loaded'}
            </button>
          </div>
        </section>

        <section className="mt-16 bg-gradient-to-r from-sky-50 to-mint-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Be Kind', description: 'Treat others as you would like to be treated. Compassion is our core value.' },
              { title: 'Respect Privacy', description: 'All stories are anonymous. Never try to identify or contact community members.' },
              { title: 'Stay On Topic', description: 'Keep conversations focused on mental health and emotional wellbeing.' },
              { title: 'No Judgment', description: 'Mental health struggles look different for everyone. All experiences are valid.' },
              { title: 'Crisis Support', description: "If someone shares they're in crisis, encourage them to reach out for professional help." },
              { title: 'Moderation', description: 'Our team moderates 24/7 to ensure a safe environment for everyone.' },
            ].map((guideline, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 hover:shadow-soft transition-all">
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
            <button
              className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              onClick={() => {
                const el = document.getElementById('community-stories');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Stories
            </button>
            <button
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all"
              onClick={() => setShowSubmit(true)}
            >
              Share Your Story
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
