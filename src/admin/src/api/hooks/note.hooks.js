import { QueryClient, useQueryClient, useMutation } from "@tanstack/react-query";

import { invalidateMunicipalityCollections, invalidateMunicipalityHistory } from "../../api-hooks.js";

import { createNote, deleteNote } from "../routes/note.routes.js";

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["note"],
    mutationFn: (args) => createNote(args),
    onSuccess: (note) => {
      if (note.item_type === "municipality") {
        invalidateMunicipalityCollections(queryClient, note.item_id);
        invalidateMunicipalityHistory(queryClient, note.item_id);
      }
    },
  });
}

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["note"],
    mutationFn: (args) => deleteNote(args),
    onSuccess: (note) => {
      if (note.item_type === "municipality") {
        invalidateMunicipalityCollections(queryClient, note.item_id);
        invalidateMunicipalityHistory(queryClient, note.item_id);
      }
    },
  });
}
