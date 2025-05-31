import React, { useState, useEffect } from 'react';
import { FaUsers, FaCamera } from 'react-icons/fa';
import { FiX, FiImage } from "react-icons/fi";
import { backendURL } from '@/lib/socket';
import { useRouter } from 'next/navigation';

const GroupSidebar = ({ isOpen, onClose, group, onGroupDeleted, onGroupImageChanged }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [currentGroupImage, setCurrentGroupImage] = useState(group?.imageUrl || null);
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

    const handleImagePick = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageUploading(true);
            const formData = new FormData();
            formData.append('image', file);
            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                if (res.ok && data.url) {
                    console.log('Uploaded Image URL:', data.url);
                    console.log('Public ID:', data.public_id);
                    
                    // Update group image in the database
                    const updateRes = await fetch(`${backendURL}/api/groups/${group._id}/image`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            imageUrl: data.url,
                            imagePublicId: data.public_id 
                        }),
                    });
                    
                    if (updateRes.ok) {
                        setCurrentGroupImage(data.url);
                        // Notify parent about image change, pass new image URL
                        if (typeof onGroupImageChanged === 'function') {
                            onGroupImageChanged(data.url);
                        }
                        // Refresh the page to show new image
                        router.refresh();
                    } else {
                        const errorData = await updateRes.json();
                        alert(errorData.error || 'Failed to update group image');
                    }
                } else {
                    alert(data.error || 'Image upload failed');
                }
            } catch (err) {
                alert('Image upload failed');
            } finally {
                setImageUploading(false);
            }
        }
    };

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
                        {/* Group Image */}
                        <div className="flex flex-col items-center gap-4 mb-6">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200 border-4 border-white shadow-lg overflow-hidden">
                                    {imageUploading ? (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                            </svg>
                                        </div>
                                    ) : currentGroupImage ? (
                                        <img 
                                            src={currentGroupImage} 
                                            alt={group.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FaUsers className="text-purple-600 text-4xl" />
                                        </div>
                                    )}
                                </div>
                                <label 
                                    htmlFor="group-image-upload" 
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                                >
                                    <FaCamera className="text-white text-2xl" />
                                </label>
                                <input
                                    id="group-image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImagePick}
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">{group.name}</h2>
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