import { useState } from "react";
import { LuTrash, LuPencil } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { useDeleteNote, Note } from "../../api/notes";
import { EditNote } from "./edit-note";

type NoteListProps = {
  notes: Note[];
  jobId: number;
};

export const NoteList = ({ notes, jobId }: NoteListProps) => {
  const deleteNoteMutation = useDeleteNote();
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const handleDelete = async (noteId: number) => {
    try {
      await deleteNoteMutation.mutateAsync({ noteId, _jobId: jobId });
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleEdit = (noteId: number) => {
    setEditingNoteId(noteId);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
  };

  const handleEditSuccess = () => {
    setEditingNoteId(null);
  };

  if (notes.length === 0) {
    return (
      <div className="text-muted-foreground text-sm italic">
        No notes yet. Create one to get started!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="rounded-lg border border-border p-4 space-y-2 hover:border-primary/20 transition-colors duration-200"
        >
          {editingNoteId === note.id ? (
            <EditNote
              note={note}
              jobId={jobId}
              onSuccess={handleEditSuccess}
              onCancel={handleCancelEdit}
            />
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div className="text-xs text-muted-foreground">
                  {new Date(note.createdAt).toLocaleString()}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="outlineMuted"
                    className="flex items-center justify-center w-6 h-6 p-1"
                    onClick={() => handleEdit(note.id)}
                  >
                    <LuPencil className="stroke-foreground/50" />
                  </Button>
                  <Button
                    variant="outlineMuted"
                    className="flex items-center justify-center w-6 h-6 p-1"
                    onClick={() => handleDelete(note.id)}
                    disabled={deleteNoteMutation.isPending}
                  >
                    <LuTrash className="stroke-foreground/50" />
                  </Button>
                </div>
              </div>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};
