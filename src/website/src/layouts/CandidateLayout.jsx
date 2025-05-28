import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

import { Outlet } from "react-router";

export const CandidateLayout = ({ children }) => {
  return (
    <section className="layout candidate-layout">
      <Header />
      <section className="layout-content">
        <Outlet />
      </section>
      <Footer />
    </section>
  );
};
