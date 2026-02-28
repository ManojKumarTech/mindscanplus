import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../backend/firebase.ts';
import { useAuth } from '../context/AuthContext';

interface UserRecord {
  id: string;
  email?: string | null;
  createdAt?: any;
}

const ADMINS = ['admin@mindscanplus.com']; // replace with real admin emails

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    // optionally block non-admins
    if (user.email && !ADMINS.includes(user.email)) {
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

  if (!user) {
    return <p className="p-8">You must be signed in to view this page.</p>;
  }

  if (user.email && !ADMINS.includes(user.email)) {
    return <p className="p-8">You are not authorized to view this page.</p>;
  }

  if (loading) {
    return <p className="p-8">Loading...</p>;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">UID</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2 text-sm break-all">{u.id}</td>
                <td className="px-4 py-2 text-sm">{u.email || '–'}</td>
                <td className="px-4 py-2 text-sm">{u.createdAt?.toDate?.()?.toLocaleString() || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
