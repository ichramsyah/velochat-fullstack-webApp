import { Navigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useUserStore((state) => state);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
