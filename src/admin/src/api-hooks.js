import { QueryClient, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  /////// Create Routes ///////
  createOffice,
  createElection,
  createRequirement,
  /////// Town Routes ////////
  getTown,
  getTownOffices,
  getTownRequirements,
  getTowns,
  updateTown,

  /////// Seat Schema ///////
  getMunicipality,
  getMunicipalityOffices,
  getMunicipalityElections,
  getMunicipalityCollections,
  getMunicipalityHistory,
  /////// Delete Routes ///////
  deleteOffice,
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

//////////// Create/Update Hooks ///////////////

export const useCreateOffice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["office"],
    mutationFn: createOffice,
    onSuccess: (office) => {
      invalidateMunicipalityOffices(queryClient, office.municipality_id);
      invalidateMunicipalityHistory(queryClient, office.municipality_id);
    },
  });
}

export const useCreateElection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["election"],
    mutationFn: (args) => createElection(args),
    onSuccess: (election) => {
      invalidateMunicipalityElections(queryClient, election.municipality_id);
      invalidateMunicipalityHistory(queryClient, election.municipality_id);
    },
  });
};

export const useCreateRequirement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["requirement"],
    mutationFn: (args) => createRequirement(args),
    onSuccess: (office) => {
      invalidateTownRequirements(queryClient, office.municipality_id);
      invalidateMunicipalityHistory(queryClient, office.municipality_id);
    },
  });
};

export const useUpdateTown = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["town"],
    mutationFn: (args) => updateTown(args),
    onSuccess: (town) => {
      invalidateTowns(queryClient);
      invalidateMunicipalityHistory(queryClient, town.id);
    },
  });
}

/////////////// Delete Hooks ///////////////

export const useDeleteOffice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["office"],
    mutationFn: deleteOffice,
    onSuccess: (office) => {
      invalidateMunicipalityOffices(queryClient, office.municipality_id);
      invalidateMunicipalityHistory(queryClient, office.municipality_id);
    },
  });
};

////////////// Seat Schema ///////////////

export const useMunicipality = (municipality_id) =>
  useQuery({
    queryKey: ["municipalities", municipality_id],
    queryFn: () => getMunicipality(municipality_id),
    enabled: municipality_id !== undefined,
  });

export const useMunicipalityOffices = (municipality_id) =>
  useQuery({
    queryKey: ["municipalities", municipality_id, "offices"],
    queryFn: () => getMunicipalityOffices(municipality_id),
    enabled: municipality_id !== undefined,
  });

export const useMunicipalityElections = (municipality_id) =>
  useQuery({
    queryKey: ["municipalities", municipality_id, "elections"],
    queryFn: () => getMunicipalityElections(municipality_id),
    enabled: municipality_id !== undefined,
  });

export const useMunicipalityCollections = (municipality_id) =>
  useQuery({
    queryKey: ["municipalities", municipality_id, "collections"],
    queryFn: () => getMunicipalityCollections(municipality_id),
    enabled: municipality_id !== undefined,
  });

export const useMunicipalityHistory = (municipality_id) =>
  useQuery({
    queryKey: ["municipalities", municipality_id, "history"],
    queryFn: () => getMunicipalityHistory(municipality_id),
    enabled: municipality_id !== undefined,
  });

// Invalidate Functions

export const invalidateTowns = (queryClient) => {
  return queryClient.invalidateQueries({
    queryKey: ["towns"],
  });
};

export const invalidateMunicipality = (queryClient, municipality_id) => {
  return queryClient.invalidateQueries({
    queryKey: ["municipalities", municipality_id],
  });
};

export const invalidateMunicipalityOffices = (queryClient, municipality_id) => {
  return queryClient.invalidateQueries({
    queryKey: ["municipalities", municipality_id, "offices"],
  });
};

export const invalidateMunicipalityElections = (queryClient, municipality_id) => {
  return queryClient.invalidateQueries({
    queryKey: ["municipalities", municipality_id, "elections"],
  });
};

export const invalidateMunicipalityCollections = (queryClient, municipality_id) => {
  return queryClient.invalidateQueries({
    queryKey: ["municipalities", municipality_id, "collections"],
  });
};

export const invalidateMunicipalityHistory = (queryClient, municipality_id) => {
  return queryClient.invalidateQueries({
    queryKey: ["municipalities", municipality_id, "history"],
  });
}
