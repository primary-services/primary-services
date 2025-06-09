import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { useParams } from "react-router";

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
  useMunicipalityCollections,
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

  const params = useParams();

  const [town, setTown] = useState(null);
  const [office, setOffice] = useState(false);
  const [election, setElection] = useState(false);

  const { data: offices, refetch: refetchOffices } = useMunicipalityOffices(
    town?.id,
  );
  const { data: elections, refetch: refetchElections } =
    useMunicipalityElections(town?.id);
  const { data: collections, refetch: refetchCollections } =
    useMunicipalityCollections(town?.id);

  useEffect(() => {
    if (!towns) {
      return setTown(null);
    }

    let { slug } = params;
    let town = towns.find((t) => {
      return t.slug === slug;
    });

    setTown(town);
  }, [towns, params]);

  const getClerk = (t) => {
    if (!t || !t.contacts) {
      return null;
    }

    return t.contacts.find((o) => {
      return o.title === "Town Clerk";
    });
  };

  const getAssistantClerk = (t) => {
    if (!t || !t.contacts) {
      return null;
    }

    return t.contacts.find((o) => {
      return o.title === "Assistant Town Clerk";
    });
  };

  const { mutateAsync: saveOffice } = useCreateOffice();
  const { mutateAsync: saveElection } = useCreateElection();

  const removeElection = (e) => {
    console.log(e);
  };

  const seatNames = (e) => {
    return (e.terms || []).map((t) => {
      return t.seat?.name || "";
    });
  };

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
                  <Link to={`/towns/ma/${t.slug}`}>{t.name}</Link>
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
            <div className="uk-flex town-header">
              <h2>
                <a href={town?.website || "#"} target="_blank">
                  {town?.name || "Town Name"}
                </a>
              </h2>
              <div>
                <a
                  href="https://docs.google.com/spreadsheets/d/1d4eHMwQLlPJGJvA7URVZ9ZICRqVVCny_uu6mj2j5a4Q/edit"
                  target="_blank"
                >
                  Town Assignments
                </a>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSekaJ1HUhgOj8M8gf6WsTKzslsCQXw7R8wGQh-swqlHv1QSww/viewform"
                  target="_blank"
                >
                  Report a Bug
                </a>
              </div>
            </div>

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
                    setOffice({
                      id: null,
                      title: "",
                      description: "",
                      salary: 0,
                      elected: true,
                      min_hours: 0,
                      max_hours: 0,
                      seats: [],
                    });
                  }}
                ></span>
              </div>
              {!!offices && (
                <div className="grid-list offices uk-width-1-1">
                  <div className="grid header">
                    <div className="width-1-12"></div>
                    <div className="width-4-12">Office</div>
                    <div className="width-3-12">Hours</div>
                    <div className="width-3-12">Salary</div>
                    {/*<div>Term Length</div>
                    <div>Next Election</div>*/}
                    <div className="width-1-12"># Seats</div>
                  </div>
                  {offices
                    .filter((o) => o.elected)
                    .map((o) => (
                      <div className="grid row">
                        <div className="width-1-12">
                          <span
                            uk-icon="pencil"
                            onClick={() => {
                              setOffice((prev) => (prev ? false : o));
                            }}
                          ></span>
                        </div>
                        <div className="width-4-12">{o.title}</div>
                        {/*<div className="width-2-12">
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
                      </div>*/}
                        <div className="width-3-12">
                          {o.min_hours}-{o.max_hours}
                        </div>
                        <div className="width-3-12">
                          {o.salary ? "$" + `${o.salary}` : "-"}
                        </div>
                        {/*<div>{o.term_length ?? "-"}</div>
                      <div>{cleanDateString(o.next_election_date) ?? "-"}</div>*/}
                        <div className="width-1-12">
                          {(o.seats || []).length}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </section>

            <section className="uk-width-1-1">
              <div className="section-header">
                <h2>Elections</h2>
                <span
                  className="icon right-aligned clickable"
                  data-uk-icon="plus-circle"
                  onClick={() => {
                    setElection({
                      id: null,
                      polling_date: null,
                      deadlines: [],
                      requirements: [],
                      forms: [],
                      terms: [],
                    });
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

                  {elections.map((e) => {
                    return (
                      <div className="grid row">
                        <div className="width-1-12">
                          <span
                            uk-icon="pencil"
                            onClick={() => {
                              setElection((prev) => (prev ? false : e));
                            }}
                          ></span>
                        </div>
                        <div className="width-5-12">{seatNames(e)}</div>
                        <div className="width-3-12">{e.type ?? "-"}</div>
                        <div className="width-3-12">
                          {cleanDateString(e.polling_date) ?? "-"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
      <Slideout active={office} setActive={setOffice}>
        <form>
          <OfficeForm
            municipality={town}
            selected={office}
            onSave={(o) => {
              return saveOffice({ municipality_id: town.id, office: o }).then(
                () => {
                  return refetchOffices();
                },
              );
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
              return saveElection({
                municipality_id: town.id,
                election: e,
              }).then(() => {
                return Promise.all([refetchElections(), refetchCollections()]);
              });
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
