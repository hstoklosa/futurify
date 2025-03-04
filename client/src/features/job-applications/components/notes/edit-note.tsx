import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import TextEditor from "@/components/ui/form/text-editor";
import { useUpdateNote, Note } from "../../api/notes";

type EditNoteFormData = {
  content: string;
};

type EditNoteProps = {
  note: Note;
  jobId: number;
  onSuccess?: () => void;
  onCancel: () => void;
};

export const EditNote = ({ note, jobId, onSuccess, onCancel }: EditNoteProps) => {
  const { control, handleSubmit } = useForm<EditNoteFormData>({
    defaultValues: {
      content: note.content,
    },
  });

  const updateNoteMutation = useUpdateNote();

  const onSubmit = async (data: EditNoteFormData) => {
    try {
      await updateNoteMutation.mutateAsync({
        content: data.content,
        noteId: note.id,
        jobId,
      });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update note:", error);
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
        label="Edit Note"
      />
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-24"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={updateNoteMutation.isPending}
          className="w-24"
        >
          Update
        </Button>
      </div>
    </form>
  );
};
