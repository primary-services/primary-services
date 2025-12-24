import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";

import { getCompletion } from "../routes/municipality.routes.js";

export const useGetCompletion = () =>
  useMutation({
    mutationKey: ["municipality"],
    mutationFn: (args) => getCompletion(),
    onSuccess: () => {
      // Wooo!
    },
  });
