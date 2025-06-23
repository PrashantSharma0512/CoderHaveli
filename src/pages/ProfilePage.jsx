import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RiAccountCircleLine, RiCameraFill } from 'react-icons/ri';
import { FaSave, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import axiosInstance from '../components/helper/axiosInstance';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    username: '',
    bio: '',
    phone: '',
    avatar: null,
    registrationDate: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { userId } = useSelector((state) => state?.login)
  // Load user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/api/get-profile?id=${userId}`);
        console.log(response);
        
        setUser(response.data?.user);
        reset(response.data);
      } catch (error) {
        toast.error('Failed to fetch profile data');
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append all fields to formData
      Object.keys(data).forEach(key => {
        if (key !== 'avatar') {
          formData.append(key, data[key]);
        }
      });

      // If there's a new avatar, append it
      if (previewAvatar && data.avatar?.[0]) {
        formData.append('avatar', data.avatar[0]);
      }

      const response = await axiosInstance.put('/api/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser(response.data);
      setPreviewAvatar(null);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    reset(user);
    setIsEditing(false);
    setPreviewAvatar(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-amber-600 dark:text-indigo-400 text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <Link
            to="/"
            className="text-amber-600 dark:text-indigo-400 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-amber-50 dark:bg-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-3 py-1 bg-amber-600 dark:bg-indigo-600 text-white rounded-md hover:bg-amber-700 dark:hover:bg-indigo-700 transition-colors"
                >
                  <FaEdit className="mr-2" /> Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSubmit(onSubmit)}
                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <FaSave className="mr-2" /> Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Avatar Section */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="relative">
                    {previewAvatar || user.avatar ? (
                      <img
                        src={user.avatar || avatar}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-amber-100 dark:border-gray-600"
                      />
                    ) : (
                      <RiAccountCircleLine className="w-32 h-32 text-gray-400 dark:text-gray-500" />
                    )}
                    {isEditing && (
                      <>
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/*"
                          {...register('avatar')}
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 bg-amber-600 dark:bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-amber-700 dark:hover:bg-indigo-700 transition-colors"
                        >
                          <RiCameraFill size={18} />
                        </label>
                      </>
                    )}
                  </div>
                  {isEditing && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Click on camera to change photo
                    </p>
                  )}
                </div>

                {/* Profile Details */}
                <div className="flex-grow space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            {...register('name', { required: 'Name is required' })}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-900 dark:text-white py-2">{user.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Username
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            {...register('username', {
                              required: 'Username is required',
                              minLength: {
                                value: 4,
                                message: 'Username must be at least 4 characters'
                              }
                            })}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                          />
                          {errors.username && (
                            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-900 dark:text-white py-2">@{user.username}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        {...register('phone')}
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {user.phone || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        {...register('bio')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {user.bio || 'No bio yet'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Read-only registration info */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Information</h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member since</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Account status</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Active</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;