import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardMetrics, processDashboardMetrics } from '../services/screeningService';
import { useUserScreenings } from './useUserScreenings';

interface UseDashboardMetricsReturn {
  metrics: DashboardMetrics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and process screening results for dashboard
 */
export function useDashboardMetrics(): UseDashboardMetricsReturn {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const results = useUserScreenings(user?.uid);

  useEffect(() => {
    if (!user) {
      setMetrics(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const processed = processDashboardMetrics(results);
      setMetrics(processed);
      setError(null);
    } catch (err: any) {
      console.error('Error processing dashboard metrics:', err);
      setError(err.message || 'Failed to prepare dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user?.uid, results]);

  const fetchMetrics = async () => {
    // recompute metrics using the latest results (useful if you want to force a refresh)
    if (!user) return;
    try {
      setLoading(true);
      const processed = processDashboardMetrics(results);
      setMetrics(processed);
      setError(null);
    } catch (err: any) {
      console.error('Error processing dashboard metrics:', err);
      setError(err.message || 'Failed to prepare dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return { metrics, loading, error, refetch: fetchMetrics };
}
