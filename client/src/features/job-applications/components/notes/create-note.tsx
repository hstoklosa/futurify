import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import TextEditor from "@/components/ui/form/text-editor";
import { useCreateNote } from "../../api/notes";

type CreateNoteFormData = {
  content: string;
};

type CreateNoteProps = {
  jobId: number;
  onSuccess?: () => void;
};

export const CreateNote = ({ jobId, onSuccess }: CreateNoteProps) => {
  const { control, handleSubmit, reset } = useForm<CreateNoteFormData>();
  const createNoteMutation = useCreateNote();

  const onSubmit = async (data: CreateNoteFormData) => {
    try {
      await createNoteMutation.mutateAsync({
        content: data.content,
        jobId,
      });
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <TextEditor
        name="content"
        control={control}
        // label="New Note"
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={createNoteMutation.isPending}
          className="w-24"
        >
          Save
        </Button>
      </div>
    </form>
  );
};
