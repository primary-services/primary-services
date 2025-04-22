import { useState, useEffect, useContext } from "react";
import { AppContexts } from "../providers";
// import { TownForm } from "../components/forms/town.js";
import { OfficeForm } from "../components/forms/office.js";
import { OfficeList } from "../components/lists/offices.js";
import { Slideout } from "../components/slideout.js";

const Clerk = ({ official }) => {
  if (!official) {
    return null;
  }

  return (
    <div>
      <div>
        <b>
          {official?.office?.title || "Clerk"}: {official?.name || ""}
        </b>
      </div>
      <div>
        {!!official.email && (
          <div>
            <b>Email: </b>
            <a href={`mailto:${official.email}`}>{official.email}</a>
          </div>
        )}
        {!!official.contact_form && (
          <div>
            <b>Contact Form: </b>
            <a href={official.contact_form}>{official.contact_form}</a>
          </div>
        )}
        {!!official.phone && (
          <div>
            <b>Phone: </b>
            <a href={`tel:${official.phone}`}>{official.phone}</a>
          </div>
        )}
      </div>
    </div>
  );
};

export const Towns = () => {
  const {
    loading,
    towns,
    town,
    getTowns,
    getTown,
    createOffice,
    createRequirement,
    createDeadline,
    createForm /*createTown*/,
  } = useContext(AppContexts.TownsContext);

  // const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState({
    office: null,
  });

  useEffect(() => {
    getTowns();
  }, []);

  const getClerk = (t) => {
    if (!t || !t.officials) {
      return null;
    }

    return t.officials.find((o) => {
      return o.office.title === "Clerk";
    });
  };

  const getAssistantClerk = (t) => {
    if (!t || !t.officials) {
      return null;
    }

    return t.officials.find((o) => {
      return o.office.title === "Assistant Clerk";
    });
  };

  const saveOffice = (town, office) => {
    createOffice(town, office);
  };

  const removeOffice = (town, office) => {
    // STUB
  };

  return (
    <section id="towns" className="page">
      <div className="sidebar">
        {loading.getTowns ? (
          <p>Loading...</p>
        ) : (
          <ul className="uk-list">
            {towns.map((t) => {
              return (
                <li key={t.name}>
                  <span
                    uk-icon="icon: check"
                    uk-tooltip={
                      !!t.completed
                        ? `title: Completed`
                        : `title: Mark Completed`
                    }
                  ></span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      getTown(t.id);
                    }}
                  >
                    {t.name}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="page-content">
        {!town && <h2>Select a town to the left to get started</h2>}
        {!!town && (
          <>
            <h2>
              <a href={town?.website || "#"} target="_blank">
                {town?.name || "Town Name"}
              </a>
            </h2>

            <div className="uk-width-1-1 uk-flex">
              <div className="uk-width-1-2">
                {!!getClerk(town) && <Clerk official={getClerk(town)} />}
              </div>
              <div className="uk-width-1-2">
                {!!getAssistantClerk(town) && (
                  <Clerk official={getAssistantClerk(town)} />
                )}
              </div>
            </div>

            <section className="uk-width-1-1">
              <div className="section-header">
                <h2>Offices</h2>
                <span
                  className="icon right-aligned"
                  data-uk-icon="plus-circle"
                  onClick={() => {
                    setSelected({ ...selected, office: {} });
                  }}
                ></span>
              </div>
              <ul className="grid-list offices uk-width-1-1">
                <li className="grid-list-header">
                  <div></div>
                  <div>Office</div>
                  {/*<div>Elected</div>*/}
                  <div>Hours</div>
                  <div>Salary</div>
                  <div>Term Length</div>
                  <div>Next Election</div>
                  <div># Seats</div>
                </li>
                {/* TODO: We should maybe move unelected offices to some other table */}
                {town.offices
                  .filter((t) => !!t.elected)
                  .map((t) => (
                    <li className="grid-list-item">
                      <div>
                        <span
                          data-uk-icon="pencil"
                          className="icon left-aligned clickable"
                          onClick={() => {
                            setSelected({ ...selected, office: t });
                          }}
                        ></span>
                        <span
                          data-uk-icon="trash"
                          className="icon left-aligned clickable"
                          onClick={() => {
                            // removeOffice(o);
                          }}
                        ></span>
                      </div>
                      <div>{t.title}</div>
                      {/*<div>
                      {t.elected ? (
                        <span
                          key="confirm"
                          className="icon affirm"
                          data-uk-icon="check"
                        ></span>
                      ) : (
                        <span
                          key="cancel"
                          className="icon cancel"
                          data-uk-icon="close"
                        ></span>
                      )}
                    </div>*/}
                      <div>
                        {t.min_hours}-{t.max_hours}
                      </div>
                      <div>{t.salary ? "$" + `${t.salary}` : "-"}</div>
                      <div>-</div>
                      <div>-</div>
                      <div>-</div>
                    </li>
                  ))}
              </ul>
            </section>
          </>
        )}
      </div>
      <Slideout
        active={!!selected.office}
        setActive={(o) => {
          setSelected({ ...selected, office: o });
        }}
      >
        <form>
          {!!selected.office && (
            <OfficeForm
              editing={selected.office || {}}
              onSave={(office) => {
                saveOffice(town, selected.office);
              }}
              onCancel={() => {
                setSelected({ ...selected, office: null });
              }}
            />
          )}
        </form>
      </Slideout>
    </section>
  );
};
