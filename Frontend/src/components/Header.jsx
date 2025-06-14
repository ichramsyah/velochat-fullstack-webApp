import { useNavigate } from 'r
      <di../store/userStore';

const Header = () => {
  const { userInfo, logout } = useUserStore((state) => state);
  const navigate = useNavigate();
      ../store/userStore';

const Header = () => {
  const { userInfo, logout } = useUserStore((state) => state);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between w-full p-4 bg-white border-b">
      <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search User
      </button>

      <h1 className="text-xl font-bold text-gray-800">VeloChat</h1>

      <div className="flex items-center space-x-4">
        <span className="font-semibold text-gray-700">{userInfo?.name}</span>
        <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">
          Logout
        </button>
      </div>
    </header>
  );

  

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between w-full p-4 bg-white border-b">
      <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search User
      </button>

      <h1 className="text-xl font-bold text-gray-800">VeloChat</h1>

      <div className="flex items-center space-x-4">
        <span className="font-semibold text-gray-700">{userInfo?.name}</span>
        <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">
          Logout
        </button>
      </div>
    </header>
  );

  
    </header
  );../store/userStore';
../store/userStore';

const Header = () => {
  const { userInfo, logout } = useUserStore((state) => state);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between w-full p-4 bg-white border-b">
      <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search User
      </button>

      <h1 className="text-xl font-bold text-gray-800">VeloChat</h1>

      <div className="flex items-center space-x-4">
        <span className="font-semibold text-gray-700">{userInfo?.name}</span>
        <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">
          Logout
        </button>
      </div>
    </header>
  );

  
const Header = () => {
  const { userInfo, logout } = useUserStore((state) => sta../store/userStore';

const Header = () => {
  const { userInfo, logout } = useUserStore((state) => state);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between w-full p-4 bg-white border-b">
      <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search User
      </button>

      <h1 className="text-xl font-bold text-gray-800">VeloChat</h1>

      <div className="flex items-center space-x-4">
        <span className="font-semibold text-gray-700">{userInfo?.name}</span>
        <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">
          Logout
        </button>
      </div>
    </header>
  );

  te);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between w-full p-4 bg-white border-b">
      <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search User
      </button>

      <h1 className="text-xl font-bold text-gray-800">VeloChat</h1>

      <div className="flex items-center space-x-4">
        <span className="font-semibold text-gray-700">{userInfo?.name}</span>
        <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">
          Logout
        </button>
      </div>
    </header>
  );

  

  
