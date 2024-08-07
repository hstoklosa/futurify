import {
    useForm,
    SubmitHandler,
    UseFormRegister,
    FieldValues,
    FormState,
    UseFormProps,
} from "react-hook-form";

type FormWrapperProps<T extends FieldValues> = {
    options: UseFormProps<T>;
    onSubmit: SubmitHandler<T>;
    children: (methods: {
        register: UseFormRegister<T>;
        formState: FormState<T>;
    }) => React.ReactNode;
};

const Form = <T extends FieldValues>({
    options,
    onSubmit,
    children,
}: FormWrapperProps<T>) => {
    const { register, handleSubmit, formState } = useForm<T>(options);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {children({
                register,
                formState,
            })}
        </form>
    );
};

export default Form;
