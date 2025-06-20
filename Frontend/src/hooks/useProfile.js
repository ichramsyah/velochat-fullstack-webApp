import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useUserStore from '../store/userStore';
import { updateUserProfile, updateProfilePicture } from '../api/userAPI';

export const useProfile = () => {
  const { userInfo, updateUserInfo } = useUserStore((state) => state);
  const navigate = useNavigate();

  const [name, setName] = useState(userInfo?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setName(userInfo?.name || '');
  }, [userInfo?.name]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewSource(reader.result);
      };
    }
  };

  const handlePictureUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('profilePicFile', selectedFile);

    try {
      const updatedData = await updateProfilePicture(formData, userInfo.token);
      updateUserInfo(updatedData);
      toast.success('Foto profil berhasil diperbarui!');
      setPreviewSource('');
      setSelectedFile(null);
    } catch (error) {
      toast.error('Gagal mengunggah foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      return toast.error('Konfirmasi password tidak cocok!');
    }
    setLoading(true);
    try {
      const updateData = password ? { name, password } : { name };
      const updatedData = await updateUserProfile(updateData, userInfo.token);
      updateUserInfo(updatedData);
      toast.success('Profil berhasil diperbarui!');
      if (password) navigate('/');
    } catch (error) {
      toast.error('Gagal memperbarui profil.');
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    previewSource,
    uploading,
    fileInputRef,
    userInfo,
    handleFileChange,
    handlePictureUpload,
    handleSubmitDetails,
    navigate,
    setPreviewSource,
    setSelectedFile,
  };
};
