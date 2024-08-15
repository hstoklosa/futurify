import { useNavigate } from "react-router-dom";

import { AuthLayout } from "@components/layout";
import RegisterForm from "@features/auth/components/RegisterForm";
import { PathConstants } from "@utils/constants";

const SignUp = () => {
    const navigate = useNavigate();

    return (
        <AuthLayout
            title="Sign Up for Free"
            subtitle="Take control of your job search"
        >
            <RegisterForm
                onSuccess={() => {
                    navigate(PathConstants.VERIFY_ACCOUNT, {
                        replace: true,
                    });
                }}
            />
        </AuthLayout>
    );
};

export default SignUp;
