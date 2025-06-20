import { Navigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';

const PublicRoute = ({ children }) => {
  const { userInfo } = useUserStore((state) => state);

  if (userInfo) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
