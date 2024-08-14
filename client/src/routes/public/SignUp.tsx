import RegisterForm from "@features/auth/components/RegisterForm";
import { AuthLayout } from "@components/layout";

const SignUp = () => {
    return (
        <AuthLayout
            title="Sign Up for Free"
            subtitle="Take control of your job search"
        >
            <RegisterForm
                onSuccess={() => {
                    // TODO: Navigate to verification page
                }}
            />
        </AuthLayout>
    );
};

export default SignUp;
