import { useNavigate } from "react-router-dom";
import LoginForm from "@features/auth/components/LoginForm";
import { AuthLayout } from "@components/layout";
import { PathConstants } from "@utils/constants";

const SignIn = () => {
    const navigate = useNavigate();

    return (
        <AuthLayout
            title="Log in"
            subtitle="Log into your account"
        >
            <LoginForm
                onSuccess={() => {
                    navigate(PathConstants.HOME, {
                        replace: true,
                    });
                }}
            />
        </AuthLayout>
    );
};

export default SignIn;
