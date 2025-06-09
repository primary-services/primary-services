import "./scss/styles.scss";

import { BrowserRouter, Routes, Route } from "react-router";

import { LandingPage } from "./pages/landing.js";
import { Towns } from "./pages/towns.js";

import { AppProviders } from "./providers";

function App() {
  return (
    <AppProviders>
      <header>
        <nav data-uk-navbar>
          <div className="uk-navbar-left">
            <ul className="uk-navbar-nav">
              <li className="uk-active">
                <a href="/" className="logo">
                  <h2>Democracy Hub Admin</h2>
                </a>
              </li>
            </ul>
          </div>
          <div className="uk-navbar-right">
            <div className="btn blocky rev">Sign In</div>
          </div>
        </nav>
      </header>
      <div className="content">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/towns" element={<Towns />} />
            <Route path="/towns/ma/:slug" element={<Towns />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AppProviders>
  );
}

export default App;
