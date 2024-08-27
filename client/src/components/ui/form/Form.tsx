import {
  useForm,
  SubmitHandler,
  FieldValues,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@utils/cn";

type FormWrapperProps<T extends FieldValues, Schema> = {
  onSubmit: SubmitHandler<T>;
  schema: Schema;
  className?: string;
  options?: UseFormProps<T>;
  children: (methods: UseFormReturn<T>) => React.ReactNode;
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
  const form = useForm<T>({ ...options, resolver: zodResolver(schema) });

  return (
    <form
      className={cn("space-y-4", className)}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {children(form)}
    </form>
  );
};

export default Form;
