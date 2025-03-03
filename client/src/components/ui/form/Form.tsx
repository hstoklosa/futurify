import {
  useForm,
  SubmitHandler,
  FieldValues,
  UseFormProps,
  UseFormReturn,
  FormProvider,
} from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@utils/cn";

type FormWrapperProps<TFormValues extends FieldValues, Schema> = {
  onSubmit: SubmitHandler<TFormValues>;
  schema: Schema;
  className?: string;
  options?: UseFormProps<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
};

const Form = <
  Schema extends ZodType<any, any, any>,
  T extends FieldValues = z.infer<Schema>
>({
  options,
  onSubmit,
  className,
  schema,
  children,
}: FormWrapperProps<T, Schema>) => {
  const form = useForm<T>({
    ...options,
    resolver: zodResolver(schema),
  });

  console.log(form.formState.errors);

  return (
    <FormProvider {...form}>
      <form
        // role="form"
        // data-testid="form"
        className={cn("space-y-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {children(form)}
      </form>

      {/* TODO: Display form errors with custom component
      {Object.entries(form.formState.errors).map(([field, error]) => (
        <div
          key={error.message}
          className="text-red-500"
        >
          {error.message}
        </div>
      ))} */}
    </FormProvider>
  );
};

export default Form;
