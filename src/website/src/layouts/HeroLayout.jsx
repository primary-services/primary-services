import { Header } from "./components/Header";
import { SubHeader } from "./components/SubHeader";
import { Hero } from "./components/Hero";
import { Footer } from "./components/Footer";

import { Outlet } from "react-router";

export const HeroLayout = ({ children }) => {
  return (
    <section className="layout hero-layout">
      <Header />
      <SubHeader />
      <Hero />
      <Outlet />
      <Footer />
    </section>
  );
};
