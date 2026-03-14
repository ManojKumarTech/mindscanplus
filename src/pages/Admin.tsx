import { collection, getDocs } from 'firebase/firestore';
import { Calendar, Eye, RefreshCw, Search, TrendingUp, Users, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../backend/firebase';
import { useAuth } from '../context/AuthContext';
import { ADMIN_UIDS } from '../utils/constants';
import {
  DashboardMetrics,
  fetchUserScreeningResults,
  processDashboardMetrics,
  ScreeningResult,
} from '../services/screeningService';
import {
  fetchGratitudeItems,
  fetchSelfCareEntries,
  fetchWins
} from '../services/selfCareService';

interface UserRecord {
  id: string;
  email?: string | null;
  name?: string | null;
  createdAt?: any;
  lastActive?: any;
}

interface UserStats {
  screeningCount: number;
  journalCount: number;
  gratitudeCount: number;
  winsCount: number;
  lastScreening?: any;
}

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [userResults, setUserResults] = useState<ScreeningResult[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  // Fetch all users
  const fetchUsers = async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);
    try {
      const q = await getDocs(collection(db, 'users'));
      const arr: UserRecord[] = q.docs.map(d => ({ id: d.id, ...d.data() })) as any;
      setUsers(arr);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (!ADMIN_UIDS.includes(user.uid)) {
      setLoading(false);
      return;
    }
    fetchUsers();
  }, [user]);

  // Filter users based on search and filter
  const filteredUsers = useMemo(() => {
    let filtered = [...users];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        (u.name?.toLowerCase().includes(term)) || 
        (u.email?.toLowerCase().includes(term)) ||
        u.id.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filterStatus === 'active') {
      filtered = filtered.filter(u => {
        if (!u.lastActive && !u.createdAt) return false;
        const lastActive = u.lastActive?.toDate?.() || (u.createdAt?.toDate?.() ? new Date(u.createdAt.toDate().getTime() + 24*60*60*1000) : null);
        if (!lastActive) return false;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return lastActive > weekAgo;
      });
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter(u => {
        const lastActive = u.lastActive?.toDate?.() || u.createdAt?.toDate?.();
        if (!lastActive) return true;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return lastActive <= weekAgo;
      });
    }

    return filtered;
  }, [users, searchTerm, filterStatus]);

  // Overview statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const activeUsers = users.filter(u => {
      const lastActive = u.lastActive?.toDate?.() || u.createdAt?.toDate?.();
      if (!lastActive) return false;
      return lastActive > weekAgo;
    }).length;

    // totalScreenings requires a Firestore collectionGroup query — show N/A
    const totalScreenings = '–';

    return {
      totalUsers,
      activeUsers,
      totalScreenings,
      inactiveUsers: totalUsers - activeUsers
    };
  }, [users]);

  // Fetch user details when selected
  useEffect(() => {
    if (!selectedUser) return;
    const uid = selectedUser.id;
    if (!uid) return;
    
    setResultsLoading(true);
    
    Promise.all([
      fetchUserScreeningResults(uid),
      fetchSelfCareEntries(uid),
      fetchGratitudeItems(uid),
      fetchWins(uid)
    ])
      .then(([results, entries, gratitude, wins]) => {
        setUserResults(results);
        setMetrics(processDashboardMetrics(results));
        setUserStats({
          screeningCount: results.length,
          journalCount: entries.length,
          gratitudeCount: gratitude.length,
          winsCount: wins.length,
          lastScreening: results[0]?.createdAt
        });
      })
      .finally(() => {
        setResultsLoading(false);
      });
  }, [selectedUser]);

  if (!user) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <p className="p-8 text-center text-gray-600">You must be signed in to view this page.</p>
      </div>
    );
  }

  if (!ADMIN_UIDS.includes(user.uid)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 shadow-softXl border border-red-100 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to view this page.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span>Loading admin data…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and view platform analytics</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Screenings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalScreenings}+</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactiveUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'all' 
                    ? 'bg-mint-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'active' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'inactive' 
                    ? 'bg-gray-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Inactive
              </button>
              <button
                onClick={() => fetchUsers(true)}
                disabled={refreshing}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-600 mb-4">
            Showing {filteredUsers.length} of {users.length} users
          </p>

          {!selectedUser ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u: UserRecord, i) => {
                      const uid = (u as any).id || `user-${i}`;
                      return (
                        <tr key={uid} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{u.name || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{u.email || '–'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {u.createdAt?.toDate?.()?.toLocaleDateString() || '-'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              u.lastActive?.toDate?.() || u.createdAt?.toDate?.() 
                                ? (() => {
                                    const lastActive = u.lastActive?.toDate?.() || u.createdAt?.toDate?.();
                                    const weekAgo = new Date();
                                    weekAgo.setDate(weekAgo.getDate() - 7);
                                    return lastActive && lastActive > weekAgo 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800';
                                  })()
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {u.lastActive?.toDate?.() || u.createdAt?.toDate?.() 
                                ? (() => {
                                    const lastActive = u.lastActive?.toDate?.() || u.createdAt?.toDate?.();
                                    const weekAgo = new Date();
                                    weekAgo.setDate(weekAgo.getDate() - 7);
                                    return lastActive && lastActive > weekAgo ? 'Active' : 'Inactive';
                                  })()
                                : 'Unknown'
                              }
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedUser(u)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* User Details View */
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  User Details: {selectedUser.name || selectedUser.email}
                </h2>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setUserResults([]);
                    setMetrics(null);
                    setUserStats(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Close
                </button>
              </div>

              {resultsLoading ? (
                <p className="text-center text-gray-500 py-8">Loading user data...</p>
              ) : (
                <>
                  {/* User Stats */}
                  {userStats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-sm text-blue-600">Screenings</p>
                        <p className="text-2xl font-bold text-blue-900">{userStats.screeningCount}</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-sm text-green-600">Journal Entries</p>
                        <p className="text-2xl font-bold text-green-900">{userStats.journalCount}</p>
                      </div>
                      <div className="bg-yellow-50 rounded-xl p-4">
                        <p className="text-sm text-yellow-600">Gratitude Items</p>
                        <p className="text-2xl font-bold text-yellow-900">{userStats.gratitudeCount}</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4">
                        <p className="text-sm text-purple-600">Wins</p>
                        <p className="text-2xl font-bold text-purple-900">{userStats.winsCount}</p>
                      </div>
                    </div>
                  )}

                  {/* Screening History */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Screening History</h3>
                    {userResults.length === 0 ? (
                      <p className="text-gray-500">No screenings available.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-3 py-2 text-left">Date</th>
                              <th className="px-3 py-2 text-left">Score</th>
                              <th className="px-3 py-2 text-left">Level</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userResults
                              .slice()
                              .sort((a, b) =>
                                (b.createdAt?.toDate?.()?.getTime() || 0) -
                                (a.createdAt?.toDate?.()?.getTime() || 0)
                              )
                              .slice(0, 20)
                              .map(r => (
                                <tr key={r.id} className="border-t">
                                  <td className="px-3 py-2">
                                    {r.createdAt?.toDate?.()?.toLocaleString() || '-'}
                                  </td>
                                  <td className="px-3 py-2 font-medium">{r.stressScore}</td>
                                  <td className="px-3 py-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                      r.stressLevel === 'Low' 
                                        ? 'bg-green-100 text-green-800' 
                                        : r.stressLevel === 'Moderate'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {r.stressLevel}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Progress Summary */}
                  {metrics && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Summary</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-gray-600">Overall Average</p>
                          <p className="text-2xl font-bold text-gray-900">{metrics.overallAverageScore}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Screenings</p>
                          <p className="text-2xl font-bold text-gray-900">{metrics.totalResults}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">This Month</p>
                          <div className="flex gap-2 mt-1">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              Low: {metrics.currentMonth.counts.Low}
                            </span>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                              Mod: {metrics.currentMonth.counts.Moderate}
                            </span>
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              High: {metrics.currentMonth.counts.High}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
