"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { FiEdit, FiMail, FiUser, FiMapPin, FiLink } from "react-icons/fi";

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        userId: "hjgjgyt1245",
        name: "Alex Johnson",
        userEmail: "alex@example.com",
        profilePicture: {
            url: "https://res.cloudinary.com/dycjlsiht/image/upload/v1745738641/images/kqpb6yndj7dv4g8xstdg.jpg",
            publicId: "kqpb6yndj7dv4g8xstdg",
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("profilePicture.")) {
            const key = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                profilePicture: { ...prev.profilePicture, [key]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.put("/user/profile", {
                userId: formData.userId,
                userName: formData.userName,
                profilePicture: formData.profilePicture,
            });
            alert("Profile updated!");
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed:", error);
            alert("Update failed!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-blue-100">
            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
                    {/* Cover */}
                    <div className="h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
                        <button
                            className="absolute bottom-4 right-4 bg-white px-4 py-1 text-sm rounded-full shadow-md text-indigo-600 font-medium flex items-center hover:scale-105 transition-transform"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <FiEdit className="mr-2" />
                            {isEditing ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>

                    {/* Profile Section */}
                    <div className="relative flex flex-col items-center text-center p-6 pt-16">
                        <img
                            src={formData.profilePicture.url}
                            alt="Avatar"
                            className="w-40 h-40 rounded-full border-4 border-white object-cover absolute -top-16"
                        />

                        <div className="pt-8 w-full max-w-lg">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <InputField
                                        icon={<FiUser />}
                                        label="Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Profile Image URL"
                                        name="profilePicture.url"
                                        value={formData.profilePicture.url}
                                        onChange={handleChange}
                                    />

                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="bg-indigo-600 text-white w-full py-2 rounded-lg mt-4 hover:bg-indigo-700 transition"
                                    >
                                        {isLoading
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="mt-4 text-gray-500 space-y-1">
                                        <span>{formData?.userId}</span>
                                    </div>

                                    <h2 className="text-3xl font-bold">
                                        {formData.name}
                                    </h2>
                                    <p className="text-gray-600 flex items-center justify-center mt-1">
                                        <FiMail className="mr-2" />
                                        {formData.userEmail}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable input field component
const InputField = ({ icon, label, name, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600">
            {label}
        </label>
        <div className="flex items-center border px-3 py-2 rounded-lg">
            {icon && <span className="text-gray-400 mr-2">{icon}</span>}
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full outline-none"
            />
        </div>
    </div>
);

export default ProfilePage;
