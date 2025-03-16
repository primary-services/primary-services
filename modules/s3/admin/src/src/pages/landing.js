import { useState, useEffect } from "react";

export const LandingPage = () => {
  return (
    <section id="landing-page" className="page">
      <p>Pretty sparse right now, but what do you want to do?</p>

      <ul className="uk-list">
        <li>
          <a href="/towns">Update Town Data</a>
        </li>
      </ul>
    </section>
  );
};
