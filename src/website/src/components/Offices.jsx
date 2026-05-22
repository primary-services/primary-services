import moment from "moment";
import { useMemo } from "react";

function Terms({ terms, office }) {
  return (
    <div className="indent skinny-margin-kids">
      {terms?.length ? (
        terms.map((term, idx) => {
          console.log(term);
          return (
            <p key={idx}>
              <span className="bold">
                {term.official.name || "Name not found"}
              </span>
              , {term.start_year} -{" "}
              {term.start_year + (office.tenure || 0) || "Present"}
            </p>
          );
        })
      ) : (
        <p className="italic">None</p>
      )}
    </div>
  );
}

function Office({ office, key }) {
  const currentYear = useMemo(
    () => +moment().add(30, "days").format("YYYY"),
    [],
  );

  const terms = useMemo(() => {
    return office.seats.reduce((acc, seat) => {
      return [...acc, ...seat.terms];
    }, []);
  }, [office.seats]);

  const incumbents = useMemo(
    () => terms.filter((term) => term.end_year >= currentYear),
    [terms],
  );

  const previousOfficials = useMemo(
    () =>
      terms
        .filter((term) => term.end_year < currentYear)
        .sort((a, b) => b.end_year - a.end_year),
    [terms],
  );

  return (
    <div className="" key={key}>
      <h3>{office.title}</h3>
      <div className="indent">
        <p>
          {office.seat_count}
          {office.seat_count > 1 ? " seats" : " seat"}, {office.tenure} year
          terms
        </p>
        <p className="bold">Incumbents</p>
        <Terms terms={incumbents} office={office} />
        {previousOfficials?.length > 0 && (
          <>
            <p className="bold">Previous Officials</p>
            <Terms terms={previousOfficials} office={office} />
          </>
        )}
      </div>
    </div>
  );
}

function Offices({ loading, error, offices }) {
  console.log("offices:", offices);
  if (loading) {
    return (
      <>
        <h2>Offices</h2>
        <p className="indent">Loading...</p>
      </>
    );
  }
  if (error) {
    return (
      <>
        <h2>Offices</h2>
        <p className="indent">Error loading offices.</p>
      </>
    );
  }
  if (!offices?.length) {
    return (
      <>
        <h2>Offices</h2>
        <p className="indent">None</p>
      </>
    );
  }
  return (
    <>
      <h2>Offices</h2>
      <div className="indent">
        {offices?.map((office) => (
          <Office key={office.name} office={office} />
        ))}
      </div>
    </>
  );
}

export default Offices;
