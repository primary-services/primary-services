import { QueryClient, useQueryClient, useMutation } from "@tanstack/react-query";

import { invalidateMunicipalityCollections, invalidateMunicipalityHistory } from "../../api-hooks.js";

import { createSource, deleteSource } from "../routes/source.routes.js";

export const useCreateSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["source"],
    mutationFn: (args) => createSource(args),
    onSuccess: (source) => {
      if (source.item_type === "municipality") {
        invalidateMunicipalityCollections(queryClient, source.item_id);
        invalidateMunicipalityHistory(queryClient, source.item_id);
      }
    },
  });
}

export const useDeleteSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["source"],
    mutationFn: (args) => deleteSource(args),
    onSuccess: (source) => {
      if (source.item_type === "municipality") {
        invalidateMunicipalityCollections(queryClient, source.item_id);
        invalidateMunicipalityHistory(queryClient, source.item_id);
      }
    },
  });
}
