import { useState, useEffect, useMemo, useContext } from "react";
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

import { useCreateNote, useDeleteNote } from "../api/hooks/note.hooks.js";
import { useCreateSource, useDeleteSource } from "../api/hooks/source.hooks.js";

import { cleanDateString, arr, obj, confirm } from "../utils.js";

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
  const [source, setSource] = useState(null);
  const [note, setNote] = useState(null);
  const [search, setSearch] = useState("");

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
  const { mutateAsync: saveNote } = useCreateNote();
  const { mutateAsync: deleteNote } = useDeleteNote();
  const { mutateAsync: saveSource } = useCreateSource();
  const { mutateAsync: deleteSource } = useDeleteSource();

  const removeElection = (e) => {
    console.log(e);
  };

  const removeOffice = (o) => {
    console.log(o);
  };

  const removeSeat = (s) => {
    console.log(s);
  };

  const seatNames = (e) => {
    return (e.terms || []).map((t) => {
      return t.seat?.name || "";
    });
  };

  const filteredTowns = useMemo(() => {
    return (towns || []).filter((t) => {
      if (search.trim() === "") {
        return true;
      } else {
        return t.name.toLowerCase().startsWith(search.toLowerCase());
      }
    });
  }, [towns, search]);

  const sourceForm = () => {
    return (
      <form className="grid row">
        <div className="width-1-12">
          <span
            key="confirm"
            className="icon affirm clickable action left-aligned"
            data-uk-icon="check"
            onClick={() => {
              return saveSource({
                item_id: town.id,
                item_type: "municipality",
                source: source,
              }).then(() => {
                setSource(null);
                refetchCollections();
              });
            }}
          ></span>
          <span
            key="cancel"
            className="icon cancel clickable action left-aligned"
            data-uk-icon="close"
            onClick={() => {
              setSource(null);
            }}
          ></span>
        </div>
        <div className="input-wrapper width-6-12">
          <input
            type="text"
            value={source.summary}
            placeholder="Summary: Town Charter, 2024 Annual Report, etc..."
            onInput={(e) => setSource({ ...source, summary: e.target.value })}
          />
        </div>
        <div className="input-wrapper width-5-12">
          <input
            type="text"
            value={source.url}
            placeholder="URL"
            onInput={(e) => setSource({ ...source, url: e.target.value })}
          />
        </div>
      </form>
    );
  };

  const noteForm = () => {
    return (
      <form>
        <div className="note grid">
          <div className="width-1-12">
            <span
              key="confirm"
              className="icon affirm clickable action left-aligned"
              data-uk-icon="check"
              onClick={() => {
                return saveNote({
                  item_id: town.id,
                  item_type: "municipality",
                  note: note,
                }).then(() => {
                  setNote(null);
                  refetchCollections();
                });
              }}
            ></span>
            <span
              key="cancel"
              className="icon cancel clickable action left-aligned"
              data-uk-icon="close"
              onClick={() => {
                setNote(null);
              }}
            ></span>
          </div>
          <div className="input-wrapper width-8-12">
            <input
              type="text"
              value={note.summary}
              placeholder="Summary: I wasn't sure about.., The mayor's election is..."
              onInput={(e) => setNote({ ...note, summary: e.target.value })}
            />
          </div>
        </div>
        <div className="note grid row">
          <div className="width-1-12"></div>
          <div className="content input-wrapper width-8-12">
            <div>
              <textarea
                type="text"
                value={note.content}
                placeholder="Note: This election system was designed by a 12th century madman"
                rows="6"
                onInput={(e) => setNote({ ...note, content: e.target.value })}
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    );
  };

  return (
    <section id="towns" className="page">
      <div className="sidebar">
        {townsLoading ? (
          <p className="loading">Loading...</p>
        ) : (
          <>
            <div className="sidebar-header">
              <form className="uk-search uk-search-default">
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="uk-search-input"
                    onInput={(e) => {
                      setSearch(e.target.value);
                    }}
                    value={search}
                  />
                  <span
                    className="uk-search-icon-flip"
                    data-uk-search-icon
                  ></span>
                </div>
              </form>
            </div>
            <ul className="uk-list">
              {filteredTowns.map((t) => {
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
          </>
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
                    <div className="width-8-12">Office</div>
                    <div className="width-2-12">
                      Shared{" "}
                      <span
                        uk-icon="icon: info; ratio: 0.9"
                        uk-tooltip="This office is shared across municipalities, e.g. regional school board position"
                      ></span>
                    </div>
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
                        <div className="width-8-12">{o.title}</div>
                        <div className="width-2-12">{o.shared ? <span uk-icon="check"></span> : undefined}</div>
                        <div className="width-1-12">
                          {(o.seats || []).length}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </section>

            {/*<section className="uk-width-1-1">
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
            </section>*/}

            <section className="uk-width-1-1">
              <div className="section-header">
                <h2>Sources</h2>
                <span
                  className="icon right-aligned clickable"
                  data-uk-icon="plus-circle"
                  onClick={() => {
                    setSource({
                      id: null,
                      summary: "",
                      url: "",
                    });
                  }}
                ></span>
              </div>

              <div>
                <div className="grid header">
                  <div className="width-1-12"></div>
                  <div className="width-6-12">Summary</div>
                  <div className="width-5-12">URL</div>
                </div>

                {!!source && !source.id && sourceForm()}

                {(collections?.sources || []).map((s) => {
                  return s.id !== source?.id ? (
                    <div className="source grid row">
                      <div className="width-1-12">
                        <span
                          className="icon clickable left-aligned"
                          uk-icon="pencil"
                          onClick={() => {
                            setSource({ ...s });
                          }}
                        ></span>
                        <span
                          className="icon clickable left-aligned"
                          uk-icon="trash"
                          onClick={() => {
                            deleteSource({
                              item_id: town.id,
                              item_type: "municipality",
                              source: { ...s },
                            }).then(() => {
                              setSource(null);
                              refetchCollections();
                            });
                          }}
                        ></span>
                      </div>
                      <div className="width-6-12">{s.summary}</div>
                      <div className="width-5-12 url">
                        <a href={s.url} target="_blank">
                          {s.url}
                        </a>
                      </div>
                    </div>
                  ) : (
                    sourceForm()
                  );
                })}
              </div>
            </section>

            <section className="uk-width-1-1">
              <div className="section-header">
                <h2>Notes</h2>
                <span
                  className="icon right-aligned clickable"
                  data-uk-icon="plus-circle"
                  onClick={() => {
                    setNote({
                      id: null,
                      summary: "",
                      content: "",
                    });
                  }}
                ></span>
              </div>

              <div>
                {!!note && !note.id && noteForm()}

                {(collections?.notes || []).map((n) => {
                  return n.id !== note?.id ? (
                    <div>
                      <div className="note grid">
                        <div className="width-1-12">
                          <span
                            className="icon clickable left-aligned"
                            uk-icon="pencil"
                            onClick={() => {
                              setNote({ ...n });
                            }}
                          ></span>
                          <span
                            className="icon clickable left-aligned"
                            uk-icon="trash"
                            onClick={() => {
                              deleteNote({
                                item_id: town.id,
                                item_type: "municipality",
                                note: { ...n },
                              }).then(() => {
                                setNote(null);
                                refetchCollections();
                              });
                            }}
                          ></span>
                        </div>
                        <div className="summary width-11-12">{n.summary}</div>
                      </div>
                      <div className="note grid row">
                        <div className="width-1-12"></div>
                        <div className="content width-8-12">
                          <div>{n.content}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    noteForm()
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
      <Slideout active={office} setActive={setOffice}>
        <form>
          <OfficeForm
            municipality={town}
            selected={office}
            onSave={async (o) => {
              console.log(arr(o.seats), arr(office.seats));

              // if (arr(o.seats).length < arr(office.seats).length) {
              //   let msg =
              //     "There are less seats than were previously saved, please confirm that this is what you wanted to do";

              //   let onSave = () => {
              //     saveOffice({
              //       municipality_id: town.id,
              //       office: o,
              //     }).then(() => {
              //       return refetchOffices();
              //     });
              //   };

              //   let onCancel = () => {
              //     setOffice(false);
              //   };

              //   await confirm(msg, onSave, onCancel, {
              //     className: "office-confirm",
              //   });

              //   return Promise.resolve();
              // } else {
              return saveOffice({ municipality_id: town.id, office: o }).then(
                () => {
                  return refetchOffices();
                },
              );
              // }
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
