import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";

import { loginRoute, signupRoute } from "../routes/auth.routes.js";

export const useSignup = () =>
  useMutation({
    mutationKey: ["user"],
    mutationFn: (args) => signupRoute(args),
    onSuccess: (user) => {
      invalidateUser(user.id);
    },
  });

export const useLogin = () =>
  useMutation({
    mutationKey: ["user"],
    mutationFn: (args) => loginRoute(args),
    onSuccess: (user) => {
      invalidateUser(user.id);
    },
  });

export const invalidateUser = (town_id) => {
  const queryClient = new QueryClient();

  return queryClient.invalidateQueries({
    queryKey: ["user"],
  });
};
