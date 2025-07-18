import { AuthProvider, AuthContext } from "./auth.provider";
import { TownsProvider, TownsContext } from "./towns.provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

let provider = (provider, props = {}) => [provider, props];

let providers = [
  provider(AuthProvider),
  provider(TownsProvider),
  provider(QueryClientProvider, { client: queryClient }),
];

const AppContexts = {
  AuthContext,
  TownsContext,
};

const AppProviders = ({ children }) => {
  for (let i = providers.length - 1; i >= 0; --i) {
    const [Provider, props] = providers[i];
    children = <Provider {...props}>{children}</Provider>;
  }
  return children;
};

export { AppContexts, AppProviders };
