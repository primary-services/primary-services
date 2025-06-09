import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

import { Outlet } from "react-router";

export const OnboardingLayout = ({ children }) => {
  return (
    <section className="layout onboarding-layout">
      <div>
        <Header />
        <section className="layout-content">
          <Outlet />
        </section>
        <Footer />
      </div>
    </section>
  );
};
