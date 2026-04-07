function Source({ source: { summary, url }, key }) {
  return (
    <div className="smoosh" key={key}>
      <h4>{summary}</h4>
      {url ? (
        <p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </p>
      ) : (
        <p className="italic">No URL provided</p>
      )}
    </div>
  );
}

function Sources({ loading, error, sources }) {
  if (loading) {
    return (
      <>
        <h2>Sources</h2>
        <p className="indent">Loading...</p>
      </>
    );
  }
  if (error) {
    return (
      <>
        <h2>Sources</h2>
        <p className="indent">Error loading sources.</p>
      </>
    );
  }
  if (!sources?.length) {
    return (
      <>
        <h2>Sources</h2>
        <p className="indent">None</p>
      </>
    );
  }
  return (
    <>
      <h2>Sources</h2>
      <div className="indent">
        {sources?.map((source) => (
          <Source key={source.name} source={source} />
        ))}
      </div>
    </>
  );
}

export default Sources;
