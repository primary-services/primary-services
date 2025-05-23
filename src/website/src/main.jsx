import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import "./scss/styles.scss";

// Layouts
import { HeroLayout } from "./layouts/HeroLayout";
import { OnboardingLayout } from "./layouts/OnboardingLayout";

// Pages
import { Landing } from "./pages/Landing";
import { OnboardingLanding } from "./pages/OnboardingLanding";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route element={<HeroLayout />}>
        <Route index element={<Landing />} />
      </Route>

      <Route path="get-involved">
        <Route element={<OnboardingLayout />}>
          <Route index element={<OnboardingLanding />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>,
);
