import { useState, useEffect, useContext } from "react";
import { AppContexts } from "../providers";
// import { TownForm } from "../components/forms/town.js";
import { OfficeForm } from "../components/forms/office.js";
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
    getTowns,
    getTown,
    createOffice,
    createRequirement,
    createDeadline,
    createForm /*createTown*/,
  } = useContext(AppContexts.TownsContext);

  const [town, setTown] = useState(null);
  const [editing, setEditing] = useState(false);
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

  // useEffect(() => {
  //   createTowns();
  // }, [towns]);

  // const createTowns = async () => {
  //   let townNames = Object.keys(towns || []);

  //   for (var i = 0; i < townNames.length; i++) {
  //     let t = towns[townNames[i]];
  //     if (!t) {
  //       return;
  //     }

  //     await createTown({
  //       name: townNames[i],
  //       type: "town",
  //       website: t.url,
  //       clerk: t.townClerk,
  //       assistant_clerk: t.assistantTownClerk,
  //     });

  //     console.log("Created Town:", townNames[i]);
  //   }
  // };

  const saveOffice = (town, office) => {
    createOffice(town, office);
  };

  console.log(towns);

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
                      setTown(t);
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
                    setEditing({});
                  }}
                ></span>
              </div>
              <ul className="grid-list offices uk-width-1-1">
                <li className="grid-list-header">
                  <div></div>
                  <div>Office</div>
                  <div>Elected</div>
                  <div>Hours</div>
                  <div>Salary</div>
                  <div>Term Length</div>
                  <div>Next Election</div>
                  <div># Seats</div>
                </li>
                {town.offices.map((t) => (
                  <li className="grid-list-item">
                    <div>
                      <span
                        uk-icon="pencil"
                        onClick={() => {
                          setEditing(!editing);
                        }}
                      ></span>
                    </div>
                    <div>{t.title}</div>
                    <div>
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
                    </div>
                    <div>
                      {t.min_hours}-{t.max_hours}
                    </div>
                    <div>{t.salary ? "$" + `${t.salary}` : "-"}</div>
                    <div>-</div>
                    <div>-</div>
                    <div>-</div>
                  </li>
                ))}
                {/* <li className="grid-list-item">
                  <div>
                    <span
                      uk-icon="pencil"
                      onClick={() => {
                        setEditing(!editing);
                      }}
                    ></span>
                  </div>
                  <div>Moderator</div>
                  <div>1 Year</div>
                  <div>Nov 2025</div>
                  <div>1</div>
                </li>
                <li className="grid-list-item">
                  <div>
                    <span
                      uk-icon="pencil"
                      onClick={() => {
                        setEditing(!editing);
                      }}
                    ></span>
                  </div>
                  <div>Tree Warden</div>
                  <div>1 Year</div>
                  <div>Nov 2025</div>
                  <div>1</div>
                </li>
                <li className="grid-list-item">
                  <div>
                    <span
                      uk-icon="pencil"
                      onClick={() => {
                        setEditing(!editing);
                      }}
                    ></span>
                  </div>
                  <div>Select Board</div>
                  <div>3 Years</div>
                  <div>Nov 2025</div>
                  <div>3</div>
                </li>
                <li className="grid-list-item">
                  <div>
                    <span
                      uk-icon="pencil"
                      onClick={() => {
                        setEditing(!editing);
                      }}
                    ></span>
                  </div>
                  <div>Board of Assessors</div>
                  <div>3 Years</div>
                  <div>Nov 2025</div>
                  <div>3</div>
                </li>
                <li className="grid-list-item">
                  <div>
                    <span
                      uk-icon="pencil"
                      onClick={() => {
                        setEditing(!editing);
                      }}
                    ></span>
                  </div>
                  <div>Board of Health</div>
                  <div>3 Years</div>
                  <div>Nov 2025</div>
                  <div>3</div>
                </li>
                <li className="grid-list-item">
                  <div>
                    <span
                      uk-icon="pencil"
                      onClick={() => {
                        setEditing(!editing);
                      }}
                    ></span>
                  </div>
                  <div>Constable</div>
                  <div>3 Years</div>
                  <div>Nov 2025</div>
                  <div>1</div>
                </li>
                <li className="grid-list-item">
                  <div>
                    <span
                      uk-icon="pencil"
                      onClick={() => {
                        setEditing(!editing);
                      }}
                    ></span>
                  </div>
                  <div>School Committee</div>
                  <div>3 Years</div>
                  <div>Nov 2025</div>
                  <div>3</div>
                </li>
                <li className="grid-list-item">
                  <div>
                    <span
                      uk-icon="pencil"
                      onClick={() => {
                        setEditing(!editing);
                      }}
                    ></span>
                  </div>
                  <div>Sewer Commission</div>
                  <div>3 Years</div>
                  <div>Nov 2025</div>
                  <div>3</div>
                </li>
                <li className="grid-list-item">
                  <div>
                    <span
                      uk-icon="pencil"
                      onClick={() => {
                        setEditing(!editing);
                      }}
                    ></span>
                  </div>
                  <div>Library Trustee</div>
                  <div>5 Years</div>
                  <div>Nov 2025</div>
                  <div>5</div>
                </li>
                <li className="grid-list-item">
                  <div>
                    <span
                      uk-icon="pencil"
                      onClick={() => {
                        setEditing(!editing);
                      }}
                    ></span>
                  </div>
                  <div>Planning Board</div>
                  <div>5 Years</div>
                  <div>Nov 2025</div>
                  <div>5</div>
                </li>
                <li className="grid-list-item">
                  <div>
                    <span
                      uk-icon="pencil"
                      onClick={() => {
                        setEditing(!editing);
                      }}
                    ></span>
                  </div>
                  <div>Park Commission</div>
                  <div>1 Year</div>
                  <div>Nov 2025</div>
                  <div>2</div>
                </li>
                <li className="grid-list-item">
                  <div>
                    <span
                      uk-icon="pencil"
                      onClick={() => {
                        setEditing(!editing);
                      }}
                    ></span>
                  </div>
                  <div>Park Commission</div>
                  <div>2 Years</div>
                  <div>Nov 2025</div>
                  <div>2</div>
                </li>
                <li className="grid-list-item">
                  <div>
                    <span
                      uk-icon="pencil"
                      onClick={() => {
                        setEditing(!editing);
                      }}
                    ></span>
                  </div>
                  <div>Park Commission</div>
                  <div>3 Years</div>
                  <div>Nov 2025</div>
                  <div>2</div>
                </li>
                <li className="grid-list-item">
                  <div>
                    <span
                      uk-icon="pencil"
                      onClick={() => {
                        setEditing(!editing);
                      }}
                    ></span>
                  </div>
                  <div>Finance Committee</div>
                  <div>3 Years</div>
                  <div>Nov 2025</div>
                  <div>6</div>
                </li> */}
              </ul>
            </section>

            {/*<section className="uk-flex">
          <section className="uk-width-1-2">
            <div className="section-header">
              <h2>Eligability Requirements</h2>
              <span
                className="icon  rounded right-aligned"
                uk-icon="plus"
              ></span>
            </div>

            <ul className="grid-list requirements uk-width-1-1">
              <li className="grid-list-header">
                <div></div>
                <div>Label</div>
                <div>Form</div>
                <div>Deadline</div>
              </li>
              <li className="grid-list-item">
                <div>
                  <span
                    uk-icon="pencil"
                    onClick={() => {
                      setEditing(!editing);
                    }}
                  ></span>
                </div>
                <div>Age Requirement</div>
                <div>None</div>
                <div>None</div>
              </li>

              <li className="grid-list-item">
                <div>
                  <span
                    uk-icon="pencil"
                    onClick={() => {
                      setEditing(!editing);
                    }}
                  ></span>
                </div>
                <div>Required Signatures</div>
                <div>Link</div>
                <div>07/01/2025</div>
              </li>
            </ul>
          </section>

          <section className="uk-width-1-2">
            <div className="section-header">
              <h2>Candidate Responsibility</h2>
              <span
                className="icon  rounded right-aligned"
                uk-icon="plus"
              ></span>
            </div>

            <ul className="grid-list responsibilties uk-width-1-1">
              <li className="grid-list-header">
                <div></div>
                <div>Label</div>
                <div>Form</div>
                <div>Deadline</div>
              </li>
              <li className="grid-list-item">
                <div>
                  <span
                    uk-icon="pencil"
                    onClick={() => {
                      setEditing(!editing);
                    }}
                  ></span>
                </div>
                <div>Financial Disclousure</div>
                <div>
                  <a href="#">25F</a>
                </div>
                <div>07/01/2025</div>
              </li>

              <li className="grid-list-item">
                <div>
                  <span
                    uk-icon="pencil"
                    onClick={() => {
                      setEditing(!editing);
                    }}
                  ></span>
                </div>
                <div>Spending Report</div>
                <div>
                  <a href="#">62F</a>
                </div>
                <div>11/05/2025</div>
              </li>
            </ul>
          </section>
        </section>*/}

            {/*<section className="uk-flex">
          <section className="uk-width-1-2">
            <div className="section-header">
              <h2>Deadlines</h2>
              <span
                className="icon  rounded right-aligned"
                uk-icon="plus"
              ></span>
            </div>

            <ul className="grid-list deadlines uk-width-1-1">
              <li className="grid-list-header">
                <div>
                  <span className="spacer" uk-icon="pencil"></span>
                </div>
                <div>Label</div>
                <div>Deadline</div>
              </li>
              <li className="grid-list-item">
                <div>
                  <span
                    uk-icon="pencil"
                    onClick={() => {
                      setEditing(!editing);
                    }}
                  ></span>
                </div>
                <div>Filing Deadline</div>
                <div>07/01/2025</div>
              </li>

              <li className="grid-list-item">
                <div>
                  <span
                    uk-icon="pencil"
                    onClick={() => {
                      setEditing(!editing);
                    }}
                  ></span>
                </div>
                <div>Election Date</div>
                <div>11/05/2025</div>
              </li>
            </ul>
          </section>

          <section className="uk-width-1-2">
            <div className="section-header">
              <h2>Forms</h2>
              <span
                className="icon  rounded right-aligned"
                uk-icon="plus"
              ></span>
            </div>

            <ul className="grid-list forms uk-width-1-1">
              <li className="grid-list-header">
                <div></div>
                <div>Label</div>
                <div>Link</div>
              </li>
              <li className="grid-list-item">
                <div>
                  <span
                    uk-icon="pencil"
                    onClick={() => {
                      setEditing(!editing);
                    }}
                  ></span>
                </div>
                <div>Financial Disclousure</div>
                <div>
                  <a href="#">25F</a>
                </div>
              </li>

              <li className="grid-list-item">
                <div>
                  <span
                    uk-icon="pencil"
                    onClick={() => {
                      setEditing(!editing);
                    }}
                  ></span>
                </div>
                <div>Spending Report</div>
                <div>
                  <a href="#">62F</a>
                </div>
              </li>
            </ul>
          </section>
        </section>*/}
          </>
        )}
      </div>
      <Slideout active={editing} setActive={setEditing}>
        <form>
          <OfficeForm
            office={selected.office || {}}
            onSave={(office) => {
              saveOffice(town, office);
            }}
            onCancel={() => {
              setEditing(false);
            }}
          />
        </form>
      </Slideout>
    </section>
  );
};
