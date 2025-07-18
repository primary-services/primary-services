import "./scss/styles.scss";

import { Loader } from "./Loader.js";

import { AppProviders } from "./providers";

function App() {
  return (
    <AppProviders>
      <Loader />
    </AppProviders>
  );
}

export default App;
