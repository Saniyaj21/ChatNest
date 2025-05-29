import React, { useState, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { backendURL } from '@/lib/socket';
import { useRouter } from 'next/navigation';

const GroupSidebar = ({ isOpen, onClose, group, onGroupDeleted }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchMembers = async () => {
            if (!group?._id) return;
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`${backendURL}/api/groups/${group._id}/members`);
                const data = await res.json();
                if (res.ok) {
                    setMembers(data.members || []);
                } else {
                    setError(data.error || 'Failed to fetch members');
                }
            } catch (err) {
                setError('Network error');
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchMembers();
        }
    }, [group?._id, isOpen]);

    if (!group) return null;

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={onClose}
                />
            )}
            
            {/* Popup Dialog */}
            <div 
                className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
                <div 
                    className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 ${
                        isOpen ? 'scale-100' : 'scale-95'
                    }`}
                >
                    {/* Dialog Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h3 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">Group Info</h3>
                        <button 
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <FiX className="text-xl" />
                        </button>
                    </div>
                    
                    {/* Dialog Content */}
                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                        {/* Group Details */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200 border-4 border-white shadow-lg">
                                <FaUsers className="text-purple-600 text-3xl" />
                            </div>
                            <div className="text-center">
                                <h4 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">{group.name}</h4>
                                <p className="text-gray-500 mt-1">Group Chat</p>
                            </div>
                        </div>

                        {/* Group Members Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h5 className="text-lg font-semibold text-gray-700">Members</h5>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {members.length} {members.length === 1 ? 'member' : 'members'}
                                </span>
                            </div>
                            <div className="space-y-2">
                                {loading ? (
                                    <p className="text-gray-500 text-sm">Loading members...</p>
                                ) : error ? (
                                    <p className="text-red-500 text-sm">{error}</p>
                                ) : members.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No members found</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {members.map((member) => (
                                            <li key={member._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                                <img 
                                                    src={member.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`} 
                                                    alt={member.name}
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-800">{member.name}</p>
                                                    <p className="text-sm text-gray-500">{member.email}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Group Settings Section */}
                        <div className="space-y-3">
                            <h5 className="text-lg font-semibold text-gray-700">Settings</h5>
                            <div className="space-y-2">
                                {/* Add settings options here */}
                                <p className="text-gray-500 text-sm">Settings options will be added here</p>
                                <button
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                                    disabled={deleting}
                                    onClick={() => setShowConfirm(true)}
                                >
                                    {deleting ? 'Deleting...' : 'Delete Group'}
                                </button>
                                {deleteError && <p className="text-red-500 text-sm mt-1">{deleteError}</p>}
                                {/* Custom Confirm Modal */}
                                {showConfirm && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                        <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full">
                                            <h3 className="text-lg font-bold mb-2 text-gray-800">Delete Group?</h3>
                                            <p className="text-gray-600 mb-4">Are you sure you want to delete this group? This action cannot be undone.</p>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                    onClick={() => setShowConfirm(false)}
                                                    disabled={deleting}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 font-semibold disabled:opacity-50"
                                                    disabled={deleting}
                                                    onClick={async () => {
                                                        setDeleting(true);
                                                        setDeleteError('');
                                                        try {
                                                            const res = await fetch(`${backendURL}/api/groups/${group._id}`, {
                                                                method: 'DELETE',
                                                            });
                                                            if (res.ok) {
                                                                setShowConfirm(false);
                                                                onClose && onClose();
                                                                onGroupDeleted && onGroupDeleted(group._id);
                                                            } else {
                                                                const data = await res.json();
                                                                setDeleteError(data.error || 'Failed to delete group');
                                                            }
                                                        } catch (err) {
                                                            setDeleteError('Network error');
                                                        } finally {
                                                            setDeleting(false);
                                                        }
                                                    }}
                                                >
                                                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                                                </button>
                                            </div>
                                            {deleteError && <p className="text-red-500 text-sm mt-2">{deleteError}</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GroupSidebar; 