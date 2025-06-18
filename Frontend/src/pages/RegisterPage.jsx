import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authAPI';
import useUserStore from '../store/userStore';
import toast from 'react-hot-toast';
import { getOrGenerateKeys } from '../api/cryptoService';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle password

  const navigate = useNavigate();
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await registerUser({ name, email, password });
      setUserInfo(data);
      await getOrGenerateKeys(data.token);
      navigate('/');
      toast.success('Pendaftaran berhasil');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Menyamakan layout utama dengan LoginPage
    <div className="flex items-center justify-center min-h-screen bg-[#6363FC]">
      <div className="w-full max-w-[24rem] p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center pb-2 text-[#20195D]">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4 font-poppins">
          {/* Input untuk Nama */}
          <div className="relative">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded- px-3 py-2 text-gray-900 bg-transparent border border-[#20195D] rounded-lg appearance-none peer focus:outline-none focus:ring-0"
              placeholder=" "
              required
            />
            <label
              htmlFor="name"
              className="absolute bg-white text-[#323232] duration-300 transform -translate-y-5 scale-75 left-3 top-2 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5 px-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Nama
            </label>
          </div>

          {/* Input untuk Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded- px-3 py-2 text-gray-900 bg-transparent border border-[#20195D] rounded-lg appearance-none peer focus:outline-none focus:ring-0"
              placeholder=" "
              required
            />
            <label
              htmlFor="email"
              className="absolute bg-white text-[#323232] duration-300 transform -translate-y-5 scale-75 left-3 top-2 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5 px-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Email
            </label>
          </div>

          {/* Input untuk Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded- px-3 py-2 text-gray-900 bg-transparent border border-[#20195D] rounded-lg appearance-none peer focus:outline-none focus:ring-0"
              placeholder=" "
              required
            />
            <label
              htmlFor="password"
              className="absolute bg-white text-[#323232] duration-300 transform -translate-y-5 scale-75 left-3 top-2 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5 px-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Password
            </label>
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
              {showPassword ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 font-semibold text-white bg-[#6363FC] rounded-md hover:bg-[#5555D1] disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            <p className="text-[13px] pt-2 text-[#20195D]">
              Sudah punya akun?
              <Link to="/login" className="ml-1 font-medium text-blue-600 hover:text-blue-700">
                Login disini
              </Link>
            </p>
          </div>
        </form>
        <p className="text-center font-bold text-[#20195D] text-xl">or</p>
        <a href="http://localhost:5000/api/auth/google" className="flex items-center justify-center border rounded-[7px] hover:rounded-[60px] transition-all py-2">
          <img className="h-5 w-5 mr-2" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google logo" />
          <p className="text-[#20195D] text-lg">Register with Google</p>
        </a>
      </div>
    </div>
  );
};

export default RegisterPage;
