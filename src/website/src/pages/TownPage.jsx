import { useMemo } from "react";
import { useParams } from "react-router";
import Header from "../components/Header";
import Contacts from "../components/Contacts";
import Offices from "../components/Offices";
import Sources from "../components/Sources";
import Notes from "../components/Notes";
import Check from "../components/Check";
import {
  useTownBySlug,
  useCollectionsByTownId,
  useOfficesByTownId,
} from "../api-hooks";

function TownPage() {
  const { townSlug } = useParams();

  const {
    isLoading: isLoading,
    isError: isError,
    data: town,
  } = useTownBySlug(townSlug);
  const {
    isLoading: isCollectionsLoading,
    isError: isCollectionsError,
    data: collectionsData,
  } = useCollectionsByTownId(town?.id);
  const {
    isLoading: isOfficesLoading,
    isError: isOfficesError,
    data: offices,
  } = useOfficesByTownId(town?.id);

  const uses_town_meeting_electors = town?.flags?.some(
    (flag) => flag.name === "uses_town_meeting_electors",
  );
  const uses_wards_or_districts = town?.flags?.some(
    (flag) => flag.name === "uses_wards_or_districts",
  );

  if (isLoading) {
    return (
      <div className="page">
        <Header />
        <section className="town-content">
          <p>Loading...</p>
        </section>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page">
        <Header />
        <section className="town-content">
          <p>Error loading town data.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <Header />

      <section className="town-content">
        <a href={town.website} target="_blank" rel="noopener noreferrer">
          <h1 className="decapitate blue">{town.name}</h1>
        </a>
        {!!uses_town_meeting_electors && (
          <p>
            This town uses town meeting electors. <Check />
          </p>
        )}
        {!!uses_wards_or_districts && (
          <p>
            This town uses wards or districts. <Check />
          </p>
        )}
        <Contacts contacts={town.contacts} />
        <Offices
          offices={offices}
          loading={isOfficesLoading}
          error={isOfficesError}
        />
        <Sources
          sources={collectionsData?.sources}
          loading={isCollectionsLoading}
          error={isCollectionsError}
        />
        {/*<Notes
          notes={collectionsData?.notes}
          loading={isCollectionsLoading}
          error={isCollectionsError}
        />*/}
      </section>
    </div>
  );
}

export default TownPage;
