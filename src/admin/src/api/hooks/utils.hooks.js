import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { fetchMarkdown, toggleFlag } from "../routes/utils.routes.js";

export const useGetMarkdown = () =>
  useMutation({
    mutationKey: ["file_name"],
    mutationFn: (args) => fetchMarkdown(args),
    onSuccess: (markdown) => {
      return markdown;
    },
  });

export const useToggleFlag = () =>
  useMutation({
    mutationKey: ["flag"],
    mutationFn: (args) => toggleFlag(args),
    onSuccess: (resp) => {
      return resp;
    },
  });
