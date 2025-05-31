"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUser, SignedIn } from "@clerk/nextjs";
import axios from "axios";
import { backendURL } from "@/lib/socket";
import Header from '@/components/ui/Header';

export default function ProfileWrapper() {
    return (
        <SignedIn>
            <ProfilePage />
        </SignedIn>
    );
}

function ProfilePage() {
    const { user, isSignedIn } = useUser();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ userName: "" });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [imageUploading, setImageUploading] = useState(false);
    const [imageError, setImageError] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const res = await axios.get(`${backendURL}/api/user/profile`, {
                    params: { userId: user.id },
                });
                setProfile(res.data.user);
                setForm({ userName: res.data.user.userName || "" });
                console.log("[Profile] Loaded:", res.data.user);
            } catch {
                setError("Failed to load profile");
                console.log("[Profile] Failed to load");
            } finally {
                setLoading(false);
            }
        };
        if (isSignedIn && user) fetchProfile();
    }, [isSignedIn, user]);

    // Success message timeout
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Handle username change
    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, userName: e.target.value }));
        console.log("[Edit] Username changed:", e.target.value);
    };

    // Handle avatar click
    const handleAvatarClick = () => {
        if (editMode && fileInputRef.current) {
            fileInputRef.current.click();
            console.log("[Edit] Avatar clicked, opening file picker");
        }
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setImageFile(file);
            setImageError("");
            handleImageUpload(file);
        }
    };

    // Upload image to Cloudinary
    const handleImageUpload = async (fileArg) => {
        const fileToUpload = fileArg || imageFile;
        if (!fileToUpload) return;
        setImageUploading(true);
        setImageError("");
        console.log("[Upload] Starting image upload:", fileToUpload);
        try {
            const formData = new FormData();
            formData.append("image", fileToUpload);
            const res = await axios.post("/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.data.url && res.data.public_id) {
                setForm((prev) => ({
                    ...prev,
                    profilePicture: {
                        url: res.data.url,
                        publicId: res.data.public_id,
                    },
                }));
                setSuccess("Image uploaded! Click Save to update profile.");
                console.log("[Upload] Success:", res.data);
            } else {
                setImageError("Upload failed. Try again.");
                console.log("[Upload] Failed: No url/public_id in response");
            }
        } catch (err) {
            setImageError("Image upload failed");
            console.log("[Upload] Error:", err);
        } finally {
            setImageUploading(false);
        }
    };

    // Save profile changes
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");
        console.log("[Save] Saving profile:", form);
        try {
            const payload = {
                userId: user.id,
                userName: form.userName,
            };
            if (form.profilePicture) payload.profilePicture = form.profilePicture;
            const res = await axios.put(`${backendURL}/api/user/profile`, payload);
            setProfile(res.data.user);
            setSuccess("Profile updated!");
            setEditMode(false);
            setImagePreview(null);
            setImageFile(null);
            setForm((prev) => ({ ...prev, profilePicture: undefined }));
            console.log("[Save] Success:", res.data.user);
        } catch (err) {
            setError("Failed to update profile");
            console.log("[Save] Error:", err);
        } finally {
            setSaving(false);
        }
    };

    // Cancel edit
    const handleCancel = () => {
        setEditMode(false);
        setForm({ userName: profile.userName });
        setImagePreview(null);
        setImageFile(null);
        setImageError("");
        setError("");
        setSuccess("");
        console.log("[Edit] Edit cancelled");
    };

    // Avatar source logic
    const avatarSrc = imagePreview || form.profilePicture?.url || profile?.profilePicture?.url || profile?.userAvatar || "/default-avatar.png";

    if (!isSignedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p className="text-lg text-gray-700">Please sign in to view your profile.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-gray-600">Loading profile...</p>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60 p-2 pt-0">
                <div className="mt-8 w-full flex flex-col items-center">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight mb-6">Your Profile</h1>
                    {error && <div className="mb-4 text-red-500">{error}</div>}
                    {success && <div className="mb-4 text-green-600">{success}</div>}
                    <div className="flex flex-col items-center gap-2 mb-6">
                        <div className="relative group flex flex-col items-center">
                            <div className="relative">
                                <img
                                    src={avatarSrc}
                                    alt="Profile"
                                    className={`w-24 h-24 rounded-full border-2 border-indigo-300 object-cover transition ${editMode ? 'cursor-pointer hover:brightness-90 hover:scale-105' : ''}`}
                                    onClick={editMode ? handleAvatarClick : undefined}
                                    title={editMode ? 'Click to change profile picture' : ''}
                                />
                                {editMode && imageUploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full">
                                        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                        </div>
                        {editMode && imageError && <div className="text-red-500 text-sm mt-1">{imageError}</div>}
                    </div>
                    <form onSubmit={handleSave} className="space-y-4 w-full max-w-md">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Name | Private to you.</label>
                            <input
                                type="text"
                                value={profile.name}
                                disabled
                                className="w-full px-3 py-2 border rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                type="text"
                                value={profile.userEmail}
                                disabled
                                className="w-full px-3 py-2 border rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Username | Used in chats.</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="userName"
                                    value={form.userName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/70"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={form.userName}
                                    disabled
                                    className="w-full px-3 py-2 border rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                                />
                            )}
                        </div>
                        {editMode && (
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-gradient-to-br from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 hover:from-blue-600 hover:to-purple-600 active:scale-95 transition-all duration-200 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>
                    {!editMode && (
                        <button
                            type="button"
                            onClick={() => { setEditMode(true); console.log("[Edit] Entering edit mode"); }}
                            className="mt-6 bg-gradient-to-br from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 hover:from-blue-600 hover:to-purple-600 active:scale-95 transition-all duration-200"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </>
    );
} 