import { useState, useEffect, useContext } from "react";
import { AppContexts } from "../providers";
// import { TownForm } from "../components/forms/town.js";
import { OfficeForm } from "../components/forms/office.js";
import { OfficeList } from "../components/lists/offices.js";
import { Slideout } from "../components/slideout.js";
import { RequirementForm } from "../components/forms/requirements.js";
import {
  useTownOffices,
  useTownRequirements,
  useTowns,
  useCreateOffice,
  useCreateRequirement,
} from "../api-hooks.js";
import { cleanDateString } from "../utils.js";

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
  const { data: towns, isLoading: townsLoading } = useTowns();

  const [town, setTown] = useState(null);
  const [editing, setEditing] = useState(false);
  const { data: offices } = useTownOffices(town?.id);

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

  const { mutate: saveOffice } = useCreateOffice();

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

  return (
    <section id="towns" className="page">
      <div className="sidebar">
        {townsLoading ? (
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
                  className="icon right-aligned clickable"
                  data-uk-icon="plus-circle"
                  onClick={() => {
                    setSelected({ ...selected, office: {} });
                  }}
                ></span>
              </div>
              {!!offices && (
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
                  {offices.map((o) => (
                    <li className="grid-list-item">
                      <div>
                        <span
                          uk-icon="pencil"
                          onClick={() => {
                            setEditing((prev) => (prev ? false : o));
                          }}
                        ></span>
                      </div>
                      <div>{o.title}</div>
                      <div>
                        {o.elected ? (
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
                        {o.min_hours}-{o.max_hours}
                      </div>
                      <div>{o.salary ? "$" + `${o.salary}` : "-"}</div>
                      <div>{o.term_length ?? "-"}</div>
                      <div>{cleanDateString(o.next_election_date) ?? "-"}</div>
                      <div>{o.seat_count ?? "-"}</div>
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
              )}
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
