import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';

const SidebarMenu = ({ open, onClose, anchorRef }) => {
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        (!anchorRef || !anchorRef.current || !anchorRef.current.contains(e.target))
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      className="mr-6 sidebar-menu-popup absolute right-0 top-full mt-3 w-44 bg-white rounded-lg shadow-2xl border border-blue-100 z-50 animate-fade-in-up flex flex-col transition-transform duration-200 origin-top scale-100"
      style={{ minWidth: '10rem' }}
    >
      <Link
        href="/profile"
        className="relative z-10 px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-100 text-gray-800 font-medium rounded-t-xl transition-colors duration-150 focus:outline-none"
        onClick={onClose}
      >
        Profile
      </Link>
      <Link
        href="/settings"
        className="relative z-10 px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-100 text-gray-800 font-medium rounded-b-xl transition-colors duration-150 focus:outline-none"
        onClick={onClose}
      >
        Settings
      </Link>
      <SignOutButton>
        <button
          className="relative z-10 px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-100 text-red-600 font-medium rounded-b-xl transition-colors duration-150 focus:outline-none w-full "
        >
          Log out
        </button>
      </SignOutButton>
    </div>
  );
};

export default SidebarMenu; 