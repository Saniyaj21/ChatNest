'use client'
import React, { useState } from 'react';
import { FaUsers, FaUserPlus } from 'react-icons/fa';

// Dummy data for invites
const dummyInvites = [
  {
    id: 'invite1',
    groupName: 'React Wizards',
    invitedBy: 'Alice',
  },
  {
    id: 'invite2',
    groupName: 'Next.js Ninjas',
    invitedBy: 'Bob',
  },
  {
    id: 'invite3',
    groupName: 'UI/UX Pros',
    invitedBy: 'Charlie',
  },
];

export default function GroupInvitesList() {
  const [invites, setInvites] = useState(dummyInvites);

  const handleAccept = (inviteId) => {
    setInvites((prev) => prev.filter((invite) => invite.id !== inviteId));
    // TODO: Call backend/socket to accept invite
  };

  const handleReject = (inviteId) => {
    setInvites((prev) => prev.filter((invite) => invite.id !== inviteId));
    // TODO: Call backend/socket to reject invite
  };

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
        <li key={invite.id} className="flex items-center bg-white rounded-lg shadow p-4 gap-4">
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
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => handleAccept(invite.id)}
          >
            Accept
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition ml-2"
            onClick={() => handleReject(invite.id)}
          >
            Reject
          </button>
        </li>
      ))}
    </ul>
  );
} 