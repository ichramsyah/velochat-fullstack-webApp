// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authAPI';
import useUserStore from '../store/userStore';
import toast from 'react-hot-toast';
import { getOrGenerateKeys } from '../api/cryptoService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      setUserInfo(data);
      await getOrGenerateKeys(data.token);
      navigate('/');
      toast.success('Login berhasil!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden flex items-center justify-center min-h-screen bg-[#6363FC]">
      <div className="w-full max-w-[24rem] p-8 space-y-6 bg-white rounded-xl shadow-md z-2">
        <h2 className="text-3xl font-bold text-center pb-2 text-[#20195D]">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4 font-poppins">
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
            <button type="submit" disabled={loading} className="w-full px-4 py-2.5 font-semibold text-white bg-[#6363FC] rounded-[8px] hover:rounded-[50px] transition-all">
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-[13px] pt-2 text-[#20195D]">
              Belum punya akun?
              <Link to="/register" className="ml-1 font-medium text-blue-600 hover:text-blue-700">
                Daftar disini
              </Link>
            </p>
          </div>
        </form>
        <p className="text-center font-bold text-[#20195D] text-xl">or</p>
        <a href="http://localhost:5000/api/auth/google" className="flex items-center justify-center border rounded-[7px] hover:rounded-[60px] transition-all py-2">
          <img className="h-5 w-5 mr-2" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google logo" />
          <p className="text-[#20195D] text-lg">Login with Google</p>
        </a>
      </div>
      <img src="/images/asset.png" className="absolute bottom-[-9rem] right-[-5rem] w-[20rem] h-auto z-1" alt="" />
      <h1 className="absolute md:top-10 md:left-10 top-5 left-5 text-white font-bold font-poppins md:text-4xl text-3xl">VeloChat</h1>
    </div>
  );
};

export default LoginPage;
