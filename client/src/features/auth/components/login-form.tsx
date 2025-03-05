import { Link } from "react-router-dom";

import { Button } from "@components/ui/button";
import { Form, Input } from "@components/ui/form";

import { loginInputSchema } from "@/types/auth";
import { useLogin } from "../api/login";

type LoginFormProps = {
  onSuccess: () => void;
};

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const loginMutation = useLogin({ onSuccess });

  return (
    <>
      <Form
        onSubmit={(data) => {
          loginMutation.mutate(data);
        }}
        schema={loginInputSchema}
      >
        {({ register }) => (
          <>
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
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Loading..." : "Log in"}
            </Button>
          </>
        )}
      </Form>
      <div className="mt-8">
        <p className="text-foreground/80 text-sm">
          Dont have an account?{" "}
          <Link
            to="/sign-up"
            className="text-primary font-bold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
