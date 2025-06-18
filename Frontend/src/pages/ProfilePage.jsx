// src/pages/ProfilePage.jsx
import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import useUserStore from '../store/userStore';
import { updateUserProfile, updateProfilePicture } from '../api/userAPI';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { userInfo, updateUserInfo } = useUserStore((state) => state);
  const navigate = useNavigate();

  // State untuk form nama dan password
  const [name, setName] = useState(userInfo?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // State baru untuk upload gambar
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Buat URL sementara untuk pratinjau gambar
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
    formData.append('profilePicFile', selectedFile); // 'profilePicFile' harus cocok dengan di backend

    try {
      const updatedData = await updateProfilePicture(formData, userInfo.token);
      updateUserInfo(updatedData); // Update state global
      toast.success('Foto profil berhasil diperbarui!');
      setPreviewSource(''); // Hapus pratinjau setelah berhasil
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
      if (password) navigate('/'); // Kembali ke chat jika ganti password
    } catch (error) {
      toast.error('Gagal memperbarui profil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-10 min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Edit Profil</h2>

        {/* Bagian Foto Profil */}
        <div className="flex flex-col items-center space-y-4">
          <img src={previewSource || userInfo?.profilePic} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
          {/* Tombol tak terlihat untuk memilih file */}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          {/* Tombol yang dilihat pengguna */}
          {!previewSource ? (
            <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700">
              Ubah Foto
            </button>
          ) : (
            <div className="flex space-x-4">
              <button onClick={handlePictureUpload} disabled={uploading} className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
                {uploading ? 'Mengunggah...' : 'Simpan Foto'}
              </button>
              <button
                onClick={() => {
                  setPreviewSource('');
                  setSelectedFile(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Batal
              </button>
            </div>
          )}
        </div>

        {/* Bagian Detail Profil */}
        <form onSubmit={handleSubmitDetails} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email (tidak bisa diubah)</label>
            <input type="email" value={userInfo?.email || ''} disabled className="w-full px-3 py-2 mt-1 bg-gray-200 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="password">Password Baru (kosongkan jika tidak ingin diubah)</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
          </div>
          <button type="submit" disabled={loading} className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            {loading ? 'Menyimpan...' : 'Simpan Perubahan Detail'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
