import React from 'react';
import Header from '../../components/ui/Header';
import GroupInvitesList from '../../components/groupChat/GroupInvitesList';

export default function GroupInvitesPage() {
  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-4 mt-8">Group Invites</h1>
        <GroupInvitesList />
      </div>
    </div>
  );
} 