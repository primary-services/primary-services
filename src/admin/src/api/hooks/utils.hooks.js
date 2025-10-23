import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { fetchMarkdown } from "../routes/utils.routes.js";

export const useGetMarkdown = () =>
  useMutation({
    mutationKey: ["file_name"],
    mutationFn: (args) => fetchMarkdown(args),
    onSuccess: (markdown) => {
      return markdown;
    },
  });
