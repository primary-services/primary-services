import { useMemo } from "react";

function Contact({ contact }) {
  const attributes = useMemo(() => {
    const attrs = [];
    // Handle contact name & title together to avoid awkward formatting when one is missing
    if (contact.title && contact.name) {
      attrs.push(
        <p key="name">
          <span className="bold">{contact.title}: </span>
          {contact.name}
        </p>,
      );
    } else if (contact.title) {
      attrs.push(
        <p key="name" className="bold">
          {contact.title}
        </p>,
      );
    } else if (contact.name) {
      attrs.push(
        <p key="name" className="bold">
          {contact.name}
        </p>,
      );
    }
    if (contact.phone) {
      attrs.push(
        <p key="phone">
          <span className="bold">Phone: </span>
          <a href={`tel:${contact.phone}`}>{contact.phone}</a>
        </p>,
      );
    }
    if (contact.email) {
      attrs.push(
        <p key="email">
          <span className="bold">Email: </span>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>,
      );
    }
    return attrs;
  }, [contact]);

  return (
    <div key={contact.name} className="contact">
      {attributes}
    </div>
  );
}

function Contacts({ loading, error, contacts }) {
  if (loading) {
    return (
      <>
        <h2>Contacts</h2>
        <p className="indent">Loading...</p>
      </>
    );
  }
  if (error) {
    return (
      <>
        <h2>Contacts</h2>
        <p className="indent">Error loading contacts.</p>
      </>
    );
  }
  if (!contacts?.length) {
    return (
      <>
        <h2>Contacts</h2>
        <p className="indent">None</p>
      </>
    );
  }
  return (
    <>
      <h2>Contacts</h2>
      <div className="indent">
        {contacts?.map((contact) => (
          <Contact key={contact.name} contact={contact} />
        ))}
      </div>
    </>
  );
}

export default Contacts;
