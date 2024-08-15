import { Navigate, useNavigate } from "react-router-dom";

import VerificationForm from "@features/auth/components/VerificationForm";
import useAuthStatus from "@hooks/useAuthStatus";
import { useUser } from "@features/auth/api/getUser";
import { AuthLayout } from "@components/layout";
import { PathConstants } from "@utils/constants";

const VerifyAccount = () => {
    const user = useUser();
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
            subtitle={`Enter the code sent to ${user.data?.email}`}
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
