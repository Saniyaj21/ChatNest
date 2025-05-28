'use client'
import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { backendURL } from '@/lib/socket';

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  // Search users by email
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    setSearchError('');
    setSearchResults([]);
    if (!value) return;
    setSearchLoading(true);
    try {
      const res = await fetch(`${backendURL}/api/user/search?email=${encodeURIComponent(value)}${user?.id ? `&excludeUserId=${user.id}` : ''}`);
      const data = await res.json();
      console.log('Search results:', data);
      
      if (res.ok) {
        setSearchResults(data.users.filter(u => !selectedUsers.some(sel => sel.userEmail === u.userEmail)));
      } else {
        setSearchError(data.error || 'Error searching users');
      }
    } catch (err) {
      setSearchError('Network error');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddUser = (user) => {
    setSelectedUsers((prev) => [...prev, user]);
    setSearch('');
    setSearchResults([]);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u.userId !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');
    setSubmitSuccess(false);
    try {
      const res = await fetch(`${backendURL}/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName,
          invitedUserIds: selectedUsers.map(u => u._id),
          createdBy: user.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => router.push('/'), 1500);
      } else {
        setSubmitError(data.error || 'Failed to create group');
      }
    } catch (err) {
      setSubmitError('Network error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <div className="max-w-lg mx-auto mt-10 bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Create Group</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold text-gray-700">Group Name</label>
          <input
            type="text"
            className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            placeholder="Enter group name"
          />

          <label className="block mb-2 font-semibold text-gray-700">Add People (search by email)</label>
          <input
            type="text"
            className="w-full mb-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={handleSearch}
            placeholder="Search users by email"
            autoComplete="off"
          />
          {searchLoading && <div className="text-blue-400 text-sm mb-2">Searching...</div>}
          {searchError && <div className="text-red-500 text-sm mb-2">{searchError}</div>}
          {search && searchResults.length > 0 && (
            <ul className="mb-4 bg-blue-50 rounded shadow p-2">
              {searchResults.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center justify-between py-1 px-2 hover:bg-blue-100 rounded cursor-pointer"
                  onClick={() => handleAddUser(user)}
                >
                  <div className="flex items-center gap-2">
                    <img src={user.userAvatar} alt={user.userEmail} className="w-7 h-7 rounded-full object-cover border" />
                    <span className="text-gray-800">{user.userEmail}</span>
                  </div>
                  <button type="button" className="text-blue-600 font-bold">Add</button>
                </li>
              ))}
            </ul>
          )}

          {selectedUsers.length > 0 && (
            <div className="mb-4">
              <div className="font-semibold mb-1 text-gray-700">Invited Users:</div>
              <ul className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <li key={user._id} className="bg-blue-100 px-3 py-1 rounded-full flex items-center gap-2">
                    <span>{user.name} <span className="text-xs text-gray-500">@{user.userName}</span></span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveUser(user.userId)}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition ${submitLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!groupName || selectedUsers.length === 0 || submitLoading}
          >
            {submitLoading ? 'Creating...' : 'Create Group'}
          </button>
          {submitError && <div className="text-red-500 text-sm mt-2">{submitError}</div>}
          {submitSuccess && <div className="text-green-600 text-sm mt-2">Group created! Redirecting...</div>}
        </form>
      </div>
    </div>
  );
} 