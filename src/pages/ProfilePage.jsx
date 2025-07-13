import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RiAccountCircleLine, RiCameraFill } from 'react-icons/ri';
import { FaSave, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import axiosInstance from '../components/helper/axiosInstance';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const [user, setUser] = useState(null); // Initialize as null
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { userId } = useSelector((state) => state?.login);

  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/api/get-profile?id=${userId}`);
        const userData = response.data?.user || {
          name: '',
          email: '',
          username: '',
          bio: '',
          phone: '',
          avatar: null,
          createdAt: new Date().toISOString()
        };
        setUser(userData);
        setAvatarPreview(userData.avatar);
        reset(userData);
      } catch (error) {
        toast.error('Failed to fetch profile data');
        console.error('Error:', error);
        // Set default user data if fetch fails
        setUser({
          name: '',
          email: '',
          username: '',
          bio: '',
          phone: '',
          avatar: null,
          createdAt: new Date().toISOString()
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, reset]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Prepare the update data
      const updateData = {
        id: userId,
        name: data.name || user.name,
        bio: data.bio || user.bio,
        phone: data.phone || user.phone
      };

      // Handle avatar if changed
      const fileInput = document.getElementById('avatar-upload');
      if (fileInput?.files?.[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        // Convert file to base64
        const base64Avatar = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
          reader.readAsDataURL(file);
        });
        
        updateData.avatar = base64Avatar;
      }

      const response = await axiosInstance.put('/api/update-profile', updateData);
      
      const updatedUser = response.data?.user || user;
      setUser(updatedUser);
      setAvatarPreview(updatedUser.avatar);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.error || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      reset(user);
      setAvatarPreview(user.avatar);
    }
    setIsEditing(false);
  };

  if (isLoading || !user) {
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
          <Link to="/" className="text-amber-600 dark:text-indigo-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
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
                    disabled={isLoading}
                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <FaSave className="mr-2" /> {isLoading ? 'Saving...' : 'Save Changes'}
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

          <div className="px-6 py-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Avatar Section */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="relative">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
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
                            defaultValue={user.name || ''}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-900 dark:text-white py-2">{user.name || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Username
                      </label>
                      <input
                        value={user.username || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      value={user.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        {...register('phone')}
                        defaultValue={user.phone || ''}
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
                        defaultValue={user.bio || ''}
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

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Information</h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member since</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
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