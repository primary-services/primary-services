import { AppContexts } from "./providers";

import { useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router";

import { LandingPage } from "./pages/landing.js";
import { Towns } from "./pages/towns.js";

import { SignupPage } from "./pages/auth/signup.js";
import { LoginPage } from "./pages/auth/login.js";

export const Loader = () => {
  const { loading, authorize, logout, user } = useContext(
    AppContexts.AuthContext,
  );

  useEffect(() => {
    authorize();
  }, []);

  return (
    <>
      {loading && <h1>We need a loading screen</h1>}

      {!loading && (
        <BrowserRouter>
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
                {!!user ? (
                  <>
                    <div>
                      Welcome <a href="#">{user.email}</a>
                    </div>
                    <div>
                      <a href="#" onClick={logout}>
                        Logout
                      </a>
                    </div>
                  </>
                ) : (
                  <span>
                    <Link to="/login" className="btn blocky rev">
                      Sign In
                    </Link>

                    <Link to="/signup" className="btn blocky rev">
                      Sign Up
                    </Link>
                  </span>
                )}
              </div>
            </nav>
          </header>
          <div className="content">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              <Route path="/" element={<LandingPage />} />
              <Route path="/towns" element={<Towns />} />
              <Route path="/towns/ma/:slug" element={<Towns />} />
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </>
  );
};
