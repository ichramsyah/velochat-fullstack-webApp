// src/pages/LoginSuccessPage.jsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';

const LoginSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserInfo } = useUserStore();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      const fetchUser = async () => {
        try {
          // Gunakan token untuk mengambil data user dari endpoint /me
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data: userData } = await api.get('/api/users/me', config);

          // Gabungkan data user dan token, lalu simpan ke state global
          const fullUserInfo = { ...userData, token };
          setUserInfo(fullUserInfo);

          // Arahkan ke halaman utama
          navigate('/');
        } catch (error) {
          console.error('Gagal mengambil data user setelah login OAuth', error);
          navigate('/login'); // Jika gagal, kembalikan ke halaman login
        }
      };
      fetchUser();
    } else {
      console.error('Tidak ada token ditemukan setelah redirect.');
      navigate('/login');
    }
  }, [searchParams, navigate, setUserInfo]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Memproses login Anda...</p>
    </div>
  );
};

export default LoginSuccessPage;
