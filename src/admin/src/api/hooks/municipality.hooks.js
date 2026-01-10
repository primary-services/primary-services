import {
  QueryClient,
  useQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";

import { getCompletion } from "../routes/municipality.routes.js";
import {
  invalidateMunicipalityHistory,
  invalidateMunicipalityWards,
} from "../../api-hooks.js";

import {
  getWards,
  createWard,
  deleteWard,
} from "../routes/municipality.routes.js";

export const useGetCompletion = () =>
  useMutation({
    mutationKey: ["municipality"],
    mutationFn: (args) => getCompletion(),
    onSuccess: () => {
      // Wooo!
    },
  });

export const useCreateWard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["municipality", "ward"],
    mutationFn: (args) => createWard(args),
    onSuccess: (ward) => {
      invalidateMunicipalityHistory(queryClient, ward.municipality_id);
      invalidateMunicipalityWards(queryClient, ward.municipality_id);
    },
  });
};

export const useDeleteWard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["municipality", "ward"],
    mutationFn: (args) => deleteWard(args),
    onSuccess: (ward) => {
      invalidateMunicipalityHistory(queryClient, ward.municipality_id);
      invalidateMunicipalityWards(queryClient, ward.municipality_id);
    },
  });
};
