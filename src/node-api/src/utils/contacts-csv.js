import { parse } from "csv-parse/sync";

export const TOWN_COLUMN = "Town";
export const MUNICIPALITY_ID_COLUMN = "Municipality ID";
export const CLERK_OFFICE_PROVIDED_INFO_COLUMN = "Clerk Office Provided Info";
export const CONTACT_INFO_LAST_UPDATED_COLUMN = "Contact Info Last Updated";
export const CONTACT_FORM = "Contact Form"
export const TOWN_CLERK_TITLE = "Town Clerk";

export const ROLES = [
  {
    title: TOWN_CLERK_TITLE,
    nameCol: "Clerk Name",
    emailCol: "Clerk Individual Email",
    officeEmailCol: "Clerk Office Email",
  },
  {
    title: "Assistant Town Clerk",
    nameCol: "Assistant Clerk Name",
    emailCol: "Assistant Clerk Individual Email",
    officeEmailCol: "Assistant Clerk Office Email",
  },
  {
    title: "Admin Assistant",
    nameCol: "Admin Assistant Name",
    emailCol: "Admin Assistant Individual Email",
    officeEmailCol: "Admin Assistant Email",
  },
];

export const CSV_COLUMNS = [
  TOWN_COLUMN,
  MUNICIPALITY_ID_COLUMN,
  CONTACT_FORM,
  ...ROLES.flatMap((role) => [role.nameCol, role.emailCol, role.officeEmailCol]),
  CLERK_OFFICE_PROVIDED_INFO_COLUMN,
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

    // Add contact form for Town Clerk if it exists
    // Later, make contact form a town-level field instead of a contact-level field
    // But for now we'll just add/export from the Town Clerk
    if (role.title === TOWN_CLERK_TITLE && contact?.contact_form) {
      row[CONTACT_FORM] = contact.contact_form;
    }
  }

  return row;
};