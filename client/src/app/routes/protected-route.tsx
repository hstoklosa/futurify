import { Navigate } from "react-router-dom";

import useAuthStatus from "@/hooks/use-auth-status";
import { PathConstants } from "@utils/constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isVerified } = useAuthStatus();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={PathConstants.LANDING}
        replace
      />
    );
  }

  if (isAuthenticated && !isVerified) {
    return (
      <Navigate
        to={PathConstants.VERIFY_ACCOUNT}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
