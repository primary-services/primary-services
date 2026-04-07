import { AuthProvider, AuthContext } from "./auth.provider";
import { OfficeProvider, OfficeContext } from "./offices.provider";

let provider = (provider, props = {}) => [provider, props];

let providers = [provider(AuthProvider), provider(OfficeProvider)];

const AppContexts = {
  AuthContext,
  OfficeContext,
};

const AppProviders = ({ children }) => {
  for (let i = providers.length - 1; i >= 0; --i) {
    const [Provider, props] = providers[i];
    children = <Provider {...props}>{children}</Provider>;
  }
  return children;
};

export { AppContexts, AppProviders };
