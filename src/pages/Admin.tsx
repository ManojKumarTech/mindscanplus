import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../backend/firebase';
import { useAuth } from '../context/AuthContext';
import {
  DashboardMetrics,
  fetchUserScreeningResults,
  processDashboardMetrics,
  ScreeningResult,
} from '../services/screeningService';

interface UserRecord {
  id: string;
  email?: string | null;
  name?: string | null;
  createdAt?: any;
}

// only this UID should have full access to all user data
const ADMIN_UID = 'dNDk5w5QYwOhiEufVHuOsEp6T472';

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [userResults, setUserResults] = useState<ScreeningResult[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    // block if not the designated admin
    if (user.uid !== ADMIN_UID) {
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      const q = await getDocs(collection(db, 'users'));
      const arr: UserRecord[] = q.docs.map(d => ({ id: d.id, ...d.data() })) as any;
      setUsers(arr);
      setLoading(false);
    };

    fetchUsers();
  }, [user]);

  // when user selection changes, fetch screening data
  useEffect(() => {
    if (!selectedUser) return;
    const uid = (selectedUser as any).id;
    if (!uid) return;
    setResultsLoading(true);
    fetchUserScreeningResults(uid)
      .then(res => {
        setUserResults(res);
        setMetrics(processDashboardMetrics(res));
      })
      .finally(() => {
        setResultsLoading(false);
      });
  }, [selectedUser]);

  if (!user) {
    return <p className="p-8">You must be signed in to view this page.</p>;
  }

  if (user.uid !== ADMIN_UID) {
    return <p className="p-8">You are not authorized to view this page.</p>;
  }

  if (loading) {
    return <p className="p-8">Loading...</p>;
  }
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {!selectedUser && (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: UserRecord, i) => {
                const uid = (u as any).id || `user-${i}`;
                const isSelected = selectedUser === u;
                return (
                  <tr
                    key={uid}
                    className={
                      `border-t cursor-pointer hover:bg-gray-50 ${
                        isSelected ? 'bg-blue-50' : ''
                      }`
                    }
                    onClick={() => setSelectedUser(u)}
                  >
                    <td className="px-4 py-2 text-sm">{u.name || '-'}</td>
                    <td className="px-4 py-2 text-sm">{u.email || '–'}</td>
                    <td className="px-4 py-2 text-sm">
                      {u.createdAt?.toDate?.()?.toLocaleString() || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {selectedUser && (
          <div className="mt-8 p-4 border rounded">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                Details for {selectedUser.name || selectedUser.email}
              </h2>
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => {
                  setSelectedUser(null);
                  setUserResults([]);
                  setMetrics(null);
                }}
              >
                Back to list
              </button>
            </div>

            {resultsLoading ? (
              <p>Loading results...</p>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">Screening History</h3>
                {userResults.length === 0 ? (
                  <p>No screenings available.</p>
                ) : (
                  <table className="w-full table-auto border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-3 py-1 text-left">Date</th>
                        <th className="px-3 py-1 text-left">Score</th>
                        <th className="px-3 py-1 text-left">Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userResults
                        .slice()
                        .sort((a, b) =>
                          (b.createdAt?.toDate?.()?.getTime() || 0) -
                          (a.createdAt?.toDate?.()?.getTime() || 0)
                        )
                        .map(r => (
                          <tr key={r.id} className="border-t">
                            <td className="px-3 py-1">
                              {r.createdAt?.toDate?.()?.toLocaleString() || '-'}
                            </td>
                            <td className="px-3 py-1">{r.stressScore}</td>
                            <td className="px-3 py-1">{r.stressLevel}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}

                {metrics && (
                  <div className="mt-4">
                    <h4 className="font-medium">Progress Summary</h4>
                    <p>Overall average score: {metrics.overallAverageScore}</p>
                    <p>Total entries: {metrics.totalResults}</p>
                    <p>
                      Last 7 days: Low {metrics.last7Days.reduce((sum, d) => sum + d.counts.Low, 0)},
                      Moderate {metrics.last7Days.reduce((sum, d) => sum + d.counts.Moderate, 0)},
                      High {metrics.last7Days.reduce((sum, d) => sum + d.counts.High, 0)}
                    </p>
                    <p>
                      This month: Low {metrics.currentMonth.counts.Low}, Moderate{' '}
                      {metrics.currentMonth.counts.Moderate}, High {metrics.currentMonth.counts.High}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
