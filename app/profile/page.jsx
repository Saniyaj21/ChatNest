"use client";
import React, { useEffect, useState } from "react";
import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import axios from "axios";
import { backendURL } from "@/lib/socket";
import Header from '@/components/ui/Header';

const ProfilePage = () => {
    const { user, isSignedIn } = useUser();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ userName: "" });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const res = await axios.get(`${backendURL}/api/user/profile`, {
                    params: { userId: user.id },
                });
                setProfile(res.data.user);
                setForm({
                    userName: res.data.user.userName || "",
                });
            } catch (err) {
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        if (isSignedIn && user) fetchProfile();
    }, [isSignedIn, user]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess("") , 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");
        try {
            const res = await axios.put(`${backendURL}/api/user/profile`, {
                userId: user.id,
                userName: form.userName,
            });
            setProfile(res.data.user);
            setSuccess("Profile updated!");
            setEditMode(false);
        } catch (err) {
            setError("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

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
            <div className="w-screen min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60 p-2 pt-0">
                <div className="mt-8 w-full flex flex-col items-center">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight mb-6">Your Profile</h1>
                    {error && <div className="mb-4 text-red-500">{error}</div>}
                    {success && <div className="mb-4 text-green-600">{success}</div>}
                    <div className="flex items-center gap-6 mb-6">
                        <img
                            src={profile.userAvatar || "/default-avatar.png"}
                            alt="Profile"
                            className="w-20 h-20 rounded-full border-2 border-indigo-300 object-cover"
                        />
                        <div>
                            <div className="text-lg font-semibold text-gray-800">{profile.name}</div>
                            <div className="text-sm text-gray-500">{profile.userEmail}</div>
                        </div>
                    </div>
                    <form onSubmit={handleSave} className="space-y-4 w-full max-w-md">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Username</label>
                            <input
                                type="text"
                                name="userName"
                                value={form.userName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/70"
                            />
                        </div>
                        <div className="flex gap-4 mt-6">
                            {editMode ? (
                                <>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-gradient-to-br from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 hover:from-blue-600 hover:to-purple-600 active:scale-95 transition-all duration-200 disabled:opacity-50"
                                    >
                                        {saving ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setEditMode(false); setForm({ userName: profile.userName }); setError(""); setSuccess(""); }}
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setEditMode(true)}
                                    className="bg-gradient-to-br from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 hover:from-blue-600 hover:to-purple-600 active:scale-95 transition-all duration-200"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default function ProfileWrapper() {
    return (
        <SignedIn>
            <ProfilePage />
        </SignedIn>
        // Optionally, you can show a message for SignedOut here
    );
} 