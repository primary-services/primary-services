import { useState, useEffect, useContext } from "react";
import { AppContexts } from "../providers";
// import { TownForm } from "../components/forms/town.js";
import { OfficeForm } from "../components/forms/office.js";
import { ElectionForm } from "../components/forms/election.js";
import { Slideout } from "../components/slideout.js";
import { RequirementForm } from "../components/forms/requirements.js";
import {
  useTownOffices,
  useTownRequirements,
  useTowns,
  useCreateOffice,
  useCreateElection,
  useCreateRequirement,
  useMunicipality,
  useMunicipalityOffices,
  useMunicipalityElections,
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
  const [office, setOffice] = useState(false);
  const [election, setElection] = useState(false);
  // const { data: offices } = useTownOffices(town?.id);
  const { data: offices } = useMunicipalityOffices(town?.id);
  const { data: elections } = useMunicipalityElections(town?.id);

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
  const { mutate: saveElection } = useCreateElection();

  const removeElection = (e) => {
    console.log(e);
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
                    setOffice({});
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
                            setOffice((prev) => (prev ? false : o));
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
                </ul>
              )}
            </section>

            <section className="uk-width-1-1">
              <div className="section-header">
                <h2>Elections</h2>
                <span
                  className="icon right-aligned clickable"
                  data-uk-icon="plus-circle"
                  onClick={() => {
                    setElection({});
                  }}
                ></span>
              </div>
              {!!elections && (
                <div>
                  <div className="grid header">
                    <div className="width-1-12"></div>
                    <div className="width-5-12">Name</div>
                    <div className="width-3-12">Type</div>
                    <div className="width-3-12">Date</div>
                  </div>

                  {elections.map((e) => (
                    <div className="grid row">
                      <div className="width-1-12">
                        <span
                          uk-icon="pencil"
                          onClick={() => {
                            setElection((prev) => (prev ? false : e));
                          }}
                        ></span>
                      </div>
                      <div className="width-5-12">
                        {e?.seats?.names.join(", ")}
                      </div>
                      <div className="width-3-12">{e.type ?? "-"}</div>
                      <div className="width-3-12">
                        {cleanDateString(e.polling_date) ?? "-"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
      <Slideout active={office} setActive={setOffice}>
        <form>
          <OfficeForm
            municipality={town}
            selected={office}
            onSave={(o) => {
              saveOffice(town, o);
            }}
            onCancel={() => {
              setOffice(false);
            }}
          />
        </form>
      </Slideout>
      <Slideout active={election} setActive={setElection}>
        <form>
          <ElectionForm
            municipality={town}
            selected={election}
            onSave={(e) => {
              saveElection(town, e);
            }}
            onCancel={() => {
              setElection(false);
            }}
          />
        </form>
      </Slideout>
    </section>
  );
};
