import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";

import { invalidateMunicipalityCollections, invalidateMunicipalityHistory } from "../../api-hooks.js";

import { createNote, deleteNote } from "../routes/note.routes.js";

export const useCreateNote = () =>
  useMutation({
    mutationKey: ["note"],
    mutationFn: (args) => createNote(args),
    onSuccess: (note) => {
      if (note.item_type === "municipality") {
        invalidateMunicipalityCollections(note.item_id);
        invalidateMunicipalityHistory(note.municipality_id);
      }
    },
  });

export const useDeleteNote = () =>
  useMutation({
    mutationKey: ["note"],
    mutationFn: (args) => deleteNote(args),
    onSuccess: (note) => {
      if (note.item_type === "municipality") {
        invalidateMunicipalityCollections(note.item_id);
        invalidateMunicipalityHistory(note.municipality_id);
      }
    },
  });
