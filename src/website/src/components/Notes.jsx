function Note({ note: { summary, content }, key }) {
  return (
    <div className="smoosh" key={key}>
      <h4>{summary}</h4>
      <p>{content}</p>
    </div>
  );
}

function Notes({ loading, error, notes }) {
  if (loading) {
    return (
      <>
        <h2>Notes</h2>
        <p className="indent">Loading...</p>
      </>
    );
  }
  if (error) {
    return (
      <>
        <h2>Notes</h2>
        <p className="indent">Error loading notes.</p>
      </>
    );
  }
  if (!notes?.length) {
    return (
      <>
        <h2>Notes</h2>
        <p className="indent">None</p>
      </>
    );
  }
  return (
    <>
      <h2>Notes</h2>
      <div className="indent">
        {notes?.map((note) => (
          <Note key={note.name} note={note} />
        ))}
      </div>
    </>
  );
}

export default Notes;
