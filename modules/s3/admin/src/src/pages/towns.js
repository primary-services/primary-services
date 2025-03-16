import { useState, useEffect, useContext } from "react";
import { AppContexts } from "../providers";
import { TownForm } from "../components/forms/town.js";

export const Towns = () => {
  const { towns, getTowns, getTown, updateTown } = useContext(
    AppContexts.TownsContext,
  );

  const [town, setTown] = useState(null);

  useEffect(() => {
    getTowns();
  }, []);

  return (
    <section id="towns" className="page">
      <div className="sidebar">
        <ul className="uk-list">
          {Object.keys(towns).map((name) => {
            let t = towns[name];

            return (
              <li key={name}>
                <span
                  uk-icon="icon: check"
                  uk-tooltip={
                    !!t.completed ? `title: Completed` : `title: Mark Completed`
                  }
                ></span>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setTown({ ...towns[name], name: name });
                  }}
                >
                  {name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="page-content">
        {!town && <h2>Select a to the left to get started</h2>}
        {!!town && <TownForm town={town} />}
      </div>
    </section>
  );
};
