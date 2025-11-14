import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";

import { invalidateMunicipalityCollections, invalidateMunicipalityHistory } from "../../api-hooks.js";

import { createSource, deleteSource } from "../routes/source.routes.js";

export const useCreateSource = () =>
  useMutation({
    mutationKey: ["source"],
    mutationFn: (args) => createSource(args),
    onSuccess: (source) => {
      if (source.item_type === "municipality") {
        invalidateMunicipalityCollections(source.item_id);
        invalidateMunicipalityHistory(source.municipality_id);
      }
    },
  });

export const useDeleteSource = () =>
  useMutation({
    mutationKey: ["source"],
    mutationFn: (args) => deleteSource(args),
    onSuccess: (source) => {
      if (source.item_type === "municipality") {
        invalidateMunicipalityCollections(source.item_id);
        invalidateMunicipalityHistory(source.municipality_id);
      }
    },
  });
