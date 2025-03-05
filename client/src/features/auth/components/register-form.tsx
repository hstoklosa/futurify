import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "@components/ui/button";
import { Form, Input } from "@components/ui/form";

import { registerInputSchema } from "@/types/auth";
import { useRegister } from "../api/register";

type RegisterFormProps = {
  onSuccess: () => void;
};

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const registerMutation = useRegister({ onSuccess });

  return (
    <>
      <Form
        onSubmit={(data) =>
          registerMutation.mutate(data, {
            onError: (error) => {
              console.log(error);
              toast("ERRORRRR");
            },
          })
        }
        schema={registerInputSchema}
      >
        {({ register }) => (
          <>
            <div className="flex gap-3">
              <Input
                type="text"
                label="First Name"
                placeholder="Your first name"
                register={register("firstName")}
              />
              <Input
                type="text"
                label="Last Name"
                placeholder="Your last name"
                register={register("lastName")}
              />
            </div>

            <Input
              type="text"
              label="Email"
              placeholder="Your email"
              register={register("email")}
            />
            <Input
              type="password"
              label="Password"
              placeholder="Your password"
              register={register("password")}
            />

            <Button
              type="submit"
              variant="default"
              className="w-full mt-5"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Loading..." : "Create Account"}
            </Button>
          </>
        )}
      </Form>

      <div className="mt-8">
        <p className="text-foreground/80 text-sm">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="text-primary font-bold"
          >
            Log in
          </Link>
        </p>
      </div>
    </>
  );
};

export default RegisterForm;
