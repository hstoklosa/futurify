import { Link } from "react-router-dom";

import { useRegister } from "@features/auth/api/register";
import { registerInputSchema } from "@types/auth";
import { Button } from "@components/ui/button";
import { Form, Input } from "@components/ui/form";

type RegisterFormProps = {
    onSuccess: () => void;
};

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
    const registerMutation = useRegister({ onSuccess });

    return (
        <>
            <Form
                onSubmit={(data) => registerMutation.mutate(data)}
                schema={registerInputSchema}
            >
                {({ register }) => (
                    <>
                        <div className="flex gap-3">
                            <Input
                                type="text"
                                name="firstName"
                                placeholder="Your first name"
                                label="First Name"
                                register={register("firstName")}
                            />
                            <Input
                                type="text"
                                name="lastName"
                                placeholder="Your last name"
                                label="Last Name"
                                register={register("lastName")}
                            />
                        </div>

                        <Input
                            type="text"
                            name="email"
                            placeholder="Your email"
                            label="Email"
                            register={register("email")}
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Your password"
                            label="Password"
                            register={register("password")}
                        />

                        <Button
                            type="submit"
                            variant="default"
                            className="w-full mt-5"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending
                                ? "Loading..."
                                : "Create Account"}
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
