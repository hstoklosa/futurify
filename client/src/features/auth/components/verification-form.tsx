import { Form, Input } from "@components/ui/form";
import { Button } from "@components/ui/button";

import { verificationSchema } from "@/types/auth";
import { useVerifyEmail } from "../api/verify-email";

type VerificationFormProps = {
  onSuccess: () => void;
};

const VerificationForm = ({ onSuccess }: VerificationFormProps) => {
  const verifyEmailMutation = useVerifyEmail({ onSuccess });

  return (
    <Form
      onSubmit={(data) => verifyEmailMutation.mutate(data.otp)}
      schema={verificationSchema}
    >
      {({ register }) => (
        <>
          <Input
            type="text"
            placeholder="Verification Code"
            label="Verification code"
            register={register("otp")}
          />

          <Button
            type="submit"
            variant="default"
            className="w-full mt-5"
            disabled={verifyEmailMutation.isPending}
          >
            {verifyEmailMutation.isPending ? "Loading..." : "Verify Email"}
          </Button>
        </>
      )}
    </Form>
  );
};

export default VerificationForm;
