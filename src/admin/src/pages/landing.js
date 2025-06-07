import { useState, useEffect } from "react";
import { Link } from "react-router";

export const LandingPage = () => {
  return (
    <section id="landing-page" className="page">
      <p>Pretty sparse right now, but what do you want to do?</p>

      <ul className="uk-list">
        <li>
          <Link to="/towns">Update Town Data</Link>
        </li>
      </ul>
    </section>
  );
};
