import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Router } from "react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import HomePage from "./pages/HomePage";
import TownPage from "./pages/TownPage";
import "./styles/main.scss";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <QueryClientProvider client={new QueryClient()}>
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/:townSlug" element={<TownPage />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>,
);
