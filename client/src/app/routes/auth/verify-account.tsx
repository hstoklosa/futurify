import { Navigate, useNavigate } from "react-router-dom";

import VerificationForm from "@/features/auth/components/verification-form";
import useAuthStatus from "@/hooks/use-auth-status";
import { useUser } from "@/features/auth/api/get-user";
import { AuthLayout } from "@components/layout";
import { PathConstants } from "@utils/constants";

const VerifyAccount = () => {
  const { data: currentUser } = useUser();
  const { isAuthenticated, isVerified } = useAuthStatus();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to={PathConstants.LANDING} />;
  }

  if (isAuthenticated && isVerified) {
    return <Navigate to={PathConstants.HOME} />;
  }

  return (
    <AuthLayout
      title={"Verify Email"}
      subtitle={`Enter the code sent to ${currentUser!.data.email}`}
    >
      <VerificationForm
        onSuccess={() => {
          navigate(PathConstants.HOME, {
            replace: true,
          });
        }}
      />
    </AuthLayout>
  );
};

export default VerifyAccount;
