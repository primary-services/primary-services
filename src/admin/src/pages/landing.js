import { useState, useEffect } from "react";

export const LandingPage = () => {
  // useEffect(() => {
  //   (async () => {
  //     const url =
  //       "https://vy7ll9tz04.execute-api.us-east-2.amazonaws.com/dev/towns";

  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       // console.log(response);
  //     } else {
  //       const json = await response.json();
  //       // console.log(json);
  //     }
  //   })();
  // }, []);

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
