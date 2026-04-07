import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import { AppProviders } from "./providers";

import "./scss/styles.scss";

// Layouts
import { HeroLayout } from "./layouts/HeroLayout";
import { OnboardingLayout } from "./layouts/OnboardingLayout";
import { CandidateLayout } from "./layouts/CandidateLayout";

// Pages
import { Landing } from "./pages/Landing";
import { OnboardingLanding } from "./pages/OnboardingLanding";
import { OnboardingOffices } from "./pages/OnboardingOffices";
import { CandidateLanding } from "./pages/CandidateLanding";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <AppProviders>
    <BrowserRouter>
      <Routes>
        <Route element={<HeroLayout />}>
          <Route index element={<Landing />} />
        </Route>

        <Route path="get-involved">
          <Route element={<OnboardingLayout />}>
            <Route index element={<OnboardingLanding />} />
            <Route path="offices" element={<OnboardingOffices />} />
          </Route>
        </Route>

        <Route path="my-candidates">
          <Route element={<OnboardingLayout />}>
            <Route index element={<CandidateLanding />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </AppProviders>,
);
