import { useEffect, useState } from 'react';
import { CommunityStory, fetchStories } from '../services/communityService';

export function useCommunityStories(limit: number = 3) {
  const [stories, setStories] = useState<CommunityStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const { stories: fetched } = await fetchStories(limit);
        setStories(fetched);
      } catch (err) {
        console.error('Failed to load community stories', err);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, [limit]);

  return { stories, loading };
}
