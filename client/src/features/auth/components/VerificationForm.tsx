import { useVerifyEmail } from "@features/auth/api/verifyEmail";
import { Form, Input } from "@components/ui/form";
import { Button } from "@components/ui/button";
import { verificationSchema } from "@/types/auth";

type VerificationFormProps = {
    onSuccess: () => void;
};

const VerificationForm = ({ onSuccess }: VerificationFormProps) => {
    const verifyEmail = useVerifyEmail({ onSuccess });

    return (
        <Form
            onSubmit={(data) => verifyEmail.mutate(data.otp)}
            schema={verificationSchema}
        >
            {({ register }) => (
                <>
                    <Input
                        type="text"
                        name="firstName"
                        placeholder="Verification Code"
                        label="Verification code"
                        register={register("otp")}
                    />

                    <Button
                        type="submit"
                        variant="default"
                        className="w-full mt-5"
                    >
                        {verifyEmail.isPending ? "Loading..." : "Verify Email"}
                    </Button>
                </>
            )}
        </Form>
    );
};

export default VerificationForm;
