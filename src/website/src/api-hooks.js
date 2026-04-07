import { useQuery } from "@tanstack/react-query";
import { getTowns, getCollections, getOffices } from "./api";

export const useTowns = () =>
  useQuery({
    queryKey: ["towns"],
    queryFn: getTowns,
  });

export const useTownBySlug = (slug) =>
  useQuery({
    queryKey: ["towns", slug],
    queryFn: () =>
      getTowns().then((towns) => towns.find((town) => town.slug === slug)),
  });

export const useCollectionsByTownId = (id) =>
  useQuery({
    queryKey: ["collections", id],
    queryFn: () =>
      id !== undefined ? getCollections(id) : Promise.resolve({}),
  });

export const useOfficesByTownId = (id) =>
  useQuery({
    queryKey: ["offices", id],
    queryFn: () => (id !== undefined ? getOffices(id) : Promise.resolve({})),
  });
