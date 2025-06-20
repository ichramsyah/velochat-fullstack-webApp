import { useProfile } from '../hooks/useProfile';

const ProfilePage = () => {
  const {
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
  } = useProfile();

  return (
    <div className="flex justify-center items-start min-h-screen bg-[#F8FAFB] px-4 py-8">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6 space-y-6 relative">
        <div className="sticky top-0 z-10 bg-white pb-3 -mx-6 px-6 pt-1 rounded-t-2xl">
          <button onClick={() => navigate(-1)} className="flex items-center text-white cursor-pointer hover:rounded-[60px] gap-1 transition-all bg-[#6363FC] rounded-[6px] px-3 py-2">
            Kembali
          </button>
        </div>
        <h2 className="text-2xl font-bold text-center text-[#20195D]">Edit Profil</h2>
        <div className="flex flex-col items-center space-y-4">
          <img src={previewSource || userInfo?.profilePic} alt="Profile" className="w-28 h-28 rounded-full object-cover ring-4 ring-gray-200" />
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          {!previewSource ? (
            <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 text-white cursor-pointer hover:rounded-[60px] gap-1 transition-all bg-[#6363FC] rounded-[6px] px-3 py-2">
              Ubah Foto
            </button>
          ) : (
            <div className="flex gap-3">
              <button onClick={handlePictureUpload} disabled={uploading} className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition">
                {uploading ? 'Mengunggah...' : 'Simpan Foto'}
              </button>
              <button
                onClick={() => {
                  setPreviewSource('');
                  setSelectedFile(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Batal
              </button>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmitDetails} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email (tidak bisa diubah)</label>
            <input type="email" value={userInfo?.email || ''} disabled className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500" />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
              Nama Lengkap
            </label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
              Password Baru
            </label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1">
              Konfirmasi Password Baru
            </label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white bg-[#6363FC] rounded-lg hover:bg-indigo-700 transition">
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
