import { TownsProvider, TownsContext } from "./towns.provider";

let provider = (provider, props = {}) => [provider, props];

let providers = [provider(TownsProvider)];

const AppContexts = {
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
