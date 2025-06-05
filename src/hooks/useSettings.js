import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { getUser } from '../features/auth/authThunks';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, fetchUserProfile } from '../features/users/usersThunks';

export const useSettings = () => {
  const dispatch = useDispatch();
  const [avatarFile, setAvatarFile] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector(state => state.user.selectedUser);

  // Initialize user data
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Fetch user profile when user changes
  useEffect(() => {
    if (user) {
      dispatch(fetchUserProfile(user.id));
    }
  }, [dispatch, user]);

  // Handle file selection for avatar
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      uploadAvatar(file);
    }
  };

  // Update user profile handler
  const updateUserProfileHandler = (userProfile) => {
    dispatch(updateUserProfile({ userProfile, userId: user.id }));
  };

  // Upload avatar to storage
  const uploadAvatar = async (file) => {
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error('Error uploading avatar:', uploadError.message);
    }

    // Get public URL
    const { publicURL, error } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (error) {
      throw new Error('Error getting public URL:', error.message);
    }

    // Update profile with new avatar URL
    await updateAvatarInDatabase(user.id, publicURL);
  };

  // Update avatar URL in database
  const updateAvatarInDatabase = async (userId, avatarUrl) => {
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId);

    if (error) throw new Error('Error updating avatar:', error.message);
  };

  return {
    state: {
      user,
      profile,
      avatarFile
    },
    actions: {
      handleFileChange,
      updateUserProfileHandler
    }
  };
};