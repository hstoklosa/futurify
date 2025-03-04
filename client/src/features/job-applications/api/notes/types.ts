export type Note = {
  id: number;
  content: string;
  jobId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateNoteDTO = {
  content: string;
  jobId: number;
};

export type NotesResponse = {
  data: Note[];
  message: string;
};

export type NoteResponse = {
  data: Note;
  message: string;
};
