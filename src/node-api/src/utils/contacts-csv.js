export const TOWN_COLUMN = "Town";
export const COMPLETION_STATUS_COLUMN = "Completion Status";
export const MUNICIPALITY_ID_COLUMN = "Municipality ID";
export const CLERK_OFFICE_PROVIDED_INFO_COLUMN = "Clerk Office Provided Info";
export const CONTACT_INFO_LAST_UPDATED_COLUMN = "Contact Info Last Updated";
export const CONTACT_FORM = "Contact Form";
export const TOWN_CLERK_TITLE = "Town Clerk";

export const ROLES = [
  {
    title: TOWN_CLERK_TITLE,
    nameCol: "Clerk Name",
    emailCol: "Clerk Individual Email",
    officeEmailCol: "Clerk Office Email",
    phoneCol: "Clerk Phone",
  },
  {
    title: "Assistant Town Clerk",
    nameCol: "Assistant Clerk Name",
    emailCol: "Assistant Clerk Individual Email",
    officeEmailCol: "Assistant Clerk Office Email",
    phoneCol: "Assistant Clerk Phone",
  },
  {
    title: "Admin Assistant",
    nameCol: "Admin Assistant Name",
    emailCol: "Admin Assistant Individual Email",
    officeEmailCol: "Admin Assistant Office Email",
    phoneCol: "Admin Assistant Phone",
  },
];

export const CSV_COLUMNS = [
  MUNICIPALITY_ID_COLUMN,
  TOWN_COLUMN,
  COMPLETION_STATUS_COLUMN,
  CLERK_OFFICE_PROVIDED_INFO_COLUMN,
  CONTACT_FORM,
  ...ROLES.flatMap((role) => [
    role.nameCol,
    role.emailCol,
    role.officeEmailCol,
    role.phoneCol,
  ]),
  CONTACT_INFO_LAST_UPDATED_COLUMN,
];

const TRUE_VALUES = ["true", "yes", "y", "1"];
const FALSE_VALUES = ["false", "no", "n", "0"];

// Accepts "" as unknown/unset (null) rather than false, since the office
// not having reported in yet is different from having confirmed no info.
export const parseBoolean = (raw) => {
  const value = (raw || "").trim().toLowerCase();

  if (value === "") return null;
  if (TRUE_VALUES.includes(value)) return true;
  if (FALSE_VALUES.includes(value)) return false;

  throw new Error(
    `Could not interpret "${raw}" for "${CLERK_OFFICE_PROVIDED_INFO_COLUMN}" as yes/no`,
  );
};

const COMPLETION_STATUSES = ["IN_PROGRESS", "DONE"];

// Accepts "" as null (status not set) rather than defaulting to one of the
// two real statuses.
export const parseCompletionStatus = (raw) => {
  const value = (raw || "").trim().toUpperCase();

  if (value === "") return null;
  if (COMPLETION_STATUSES.includes(value)) return value;

  throw new Error(
    `Could not interpret "${raw}" for "${COMPLETION_STATUS_COLUMN}" - must be one of ${COMPLETION_STATUSES.join(", ")}`,
  );
};

export const formatBoolean = (value) => {
  if (value === true) return "TRUE";
  if (value === false) return "FALSE";
  return "";
};

export const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toISOString();
};

export const buildExportRow = (municipality) => {
  const row = {
    [TOWN_COLUMN]: municipality.name,
    [COMPLETION_STATUS_COLUMN]: municipality.completionStatus,
    [MUNICIPALITY_ID_COLUMN]: municipality.id,
    [CLERK_OFFICE_PROVIDED_INFO_COLUMN]: formatBoolean(
      municipality.clerk_office_provided_info,
    ),
    [CONTACT_INFO_LAST_UPDATED_COLUMN]: formatDate(
      municipality.contact_info_last_updated,
    ),
  };

  for (const role of ROLES) {
    const contact = (municipality.contacts || []).find(
      (c) => c.title === role.title,
    );

    row[role.nameCol] = contact?.name || "";
    row[role.emailCol] = contact?.email || "";
    row[role.officeEmailCol] = contact?.office_email || "";
    row[role.phoneCol] = contact?.phone || "";

    // Add contact form for Town Clerk if it exists
    // Later, make contact form a town-level field instead of a contact-level field
    // But for now we'll just add/export from the Town Clerk
    if (role.title === TOWN_CLERK_TITLE && contact?.contact_form) {
      row[CONTACT_FORM] = contact.contact_form;
    }
  }

  return row;
};