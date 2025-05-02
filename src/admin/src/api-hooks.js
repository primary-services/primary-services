import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  createOffice,
  createRequirement,
  getTown,
  getTownOffices,
  getTownRequirements,
  getTowns,
  ////// Seat Schema //////
  getMunicipality,
  getMunicipalityOffices,
  getMunicipalityElections,
} from "./api";

export const useTowns = () =>
  useQuery({
    queryKey: ["towns"],
    queryFn: getTowns,
  });

export const useTown = (town_id) =>
  useQuery({
    queryKey: ["towns", town_id],
    queryFn: () => getTown(town_id),
    enabled: !!town_id,
  });

export const useTownOffices = (town_id) =>
  useQuery({
    queryKey: ["towns", town_id, "offices"],
    queryFn: () => getTownOffices(town_id),
    enabled: !!town_id,
  });

export const useTownRequirements = (town_id) =>
  useQuery({
    queryKey: ["towns", town_id, "requirements"],
    queryFn: () => getTownRequirements(town_id),
    enabled: !!town_id,
  });

export const invalidateTown = (town_id) => {
  const queryClient = new QueryClient();
  return queryClient.invalidateQueries({
    queryKey: ["towns", town_id],
  });
};

export const invalidateTownOffices = (town_id) => {
  const queryClient = new QueryClient();
  return queryClient.invalidateQueries({
    queryKey: ["towns", town_id, "offices"],
  });
};

export const invalidateTownRequirements = (town_id) => {
  const queryClient = new QueryClient();
  return queryClient.invalidateQueries({
    queryKey: ["towns", town_id, "requirements"],
  });
};

export const useCreateOffice = () =>
  useMutation({
    mutationKey: ["office"],
    mutationFn: (town, office) => createOffice(town, office),
    onSuccess: (office) => {
      invalidateTownOffices(office.municipality_id);
    },
  });

export const useCreateRequirement = () =>
  useMutation({
    mutationKey: ["requirement"],
    mutationFn: (town, requirement) => createRequirement(town, requirement),
    onSuccess: (office) => {
      invalidateTownRequirements(office.municipality_id);
    },
  });

////////////// Seat Schema ///////////////

export const useMunicipality = (municipality_id) =>
  useQuery({
    queryKey: ["municipalities", municipality_id],
    queryFn: () => getMunicipality(municipality_id),
    enabled: !!municipality_id,
  });

export const useMunicipalityOffices = (municipality_id) =>
  useQuery({
    queryKey: ["municipalities", municipality_id, "offices"],
    queryFn: () => getMunicipalityOffices(municipality_id),
    enabled: !!municipality_id,
  });

export const useMunicipalityElections = (municipality_id) =>
  useQuery({
    queryKey: ["municipalities", municipality_id, "elections"],
    queryFn: () => getMunicipalityElections(municipality_id),
    enabled: !!municipality_id,
  });

export const invalidateMunicipality = (municipality_id) => {
  const queryClient = new QueryClient();
  return queryClient.invalidateQueries({
    queryKey: ["municipalities", municipality_id],
  });
};

export const invalidateMunicipalityOffices = (municipality_id) => {
  const queryClient = new QueryClient();
  return queryClient.invalidateQueries({
    queryKey: ["municipalities", municipality_id, "offices"],
  });
};

export const invalidateMunicipalityElections = (municipality_id) => {
  const queryClient = new QueryClient();
  return queryClient.invalidateQueries({
    queryKey: ["municipalities", municipality_id, "elections"],
  });
};
