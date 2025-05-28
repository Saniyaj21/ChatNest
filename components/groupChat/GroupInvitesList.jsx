'use client'
import React, { useState } from 'react';
import { FaUsers, FaUserPlus } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';
import { backendURL } from '@/lib/socket';

export default function GroupInvitesList() {
  const { user } = useUser();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(''); // inviteId for which action is loading

  React.useEffect(() => {
    const fetchInvites = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${backendURL}/api/groups/invites?userId=${user.id}`);
        const data = await res.json();
        if (res.ok) {
          setInvites(data.invites || []);
        } else {
          setError(data.error || 'Failed to fetch invites');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchInvites();
  }, [user]);

  const handleAccept = async (inviteId, groupId) => {
    if (!user) return;
    setActionLoading(inviteId);
    setError('');
    try {
      const res = await fetch(`${backendURL}/api/groups/invites/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, userId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setInvites((prev) => prev.filter((invite) => invite.inviteId !== inviteId));
      } else {
        setError(data.error || 'Failed to accept invite');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setActionLoading('');
    }
  };

  const handleReject = async (inviteId, groupId) => {
    if (!user) return;
    setActionLoading(inviteId);
    setError('');
    try {
      const res = await fetch(`${backendURL}/api/groups/invites/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, userId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setInvites((prev) => prev.filter((invite) => invite.inviteId !== inviteId));
      } else {
        setError(data.error || 'Failed to reject invite');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-8">Loading invites...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }
  if (invites.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <FaUserPlus className="mx-auto text-4xl mb-2 text-blue-300" />
        <div>No pending group invites.</div>
      </div>
    );
  }

  return (
    <ul className="w-full max-w-md mx-auto mt-6 space-y-4">
      {invites.map((invite) => (
        <li key={invite.inviteId} className="flex items-center bg-white rounded-lg shadow p-4 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200 flex items-center justify-center border border-white">
              <FaUsers className="text-purple-600 text-xl" />
            </div>
            <div>
              <div className="font-semibold text-gray-800">{invite.groupName}</div>
              <div className="text-xs text-gray-500">Invited by {invite.invitedBy}</div>
            </div>
          </div>
          <button
            className={`px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${actionLoading === invite.inviteId ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleAccept(invite.inviteId, invite.groupId)}
            disabled={actionLoading === invite.inviteId}
          >
            {actionLoading === invite.inviteId ? 'Accepting...' : 'Accept'}
          </button>
          <button
            className={`px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition ml-2 ${actionLoading === invite.inviteId ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleReject(invite.inviteId, invite.groupId)}
            disabled={actionLoading === invite.inviteId}
          >
            {actionLoading === invite.inviteId ? 'Rejecting...' : 'Reject'}
          </button>
        </li>
      ))}
    </ul>
  );
} 