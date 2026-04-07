export const slugify = (text, separator = "_") => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, separator)
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, separator);
};

export const unslugify = (slug, separator = "_") => {
  return slug
    .toString()
    .toLowerCase()
    .trim()
    .replace(new RegExp(separator, "g"), " ")
    .replace(/^\w/, (c) => c.toUpperCase());
};
