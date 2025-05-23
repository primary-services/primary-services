import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

import { Outlet } from "react-router";

export const OnboardingLayout = ({ children }) => {
  return (
    <section className="layout onboarding-layout">
      <Header />
      <section className="content">
        <Outlet />
      </section>
      <Footer />
    </section>
  );
};
