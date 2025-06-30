export const validPassword = (password, confirmation) => {
  let hasMinLen = false;
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSpecial = false;
  let hasConfirmation = false;

  if (password === confirmation) {
    hasConfirmation = true;
  }

  if (password.length >= 8) {
    hasMinLen = true;
  }

  if (/[!|@|#\$|%|\^|&|_]+/g.test(password)) {
    hasSpecial = true;
  }

  if (/[A-Z]+/g.test(password)) {
    hasUpper = true;
  }

  if (/[a-z]+/g.test(password)) {
    hasLower = true;
  }

  if (/[0-9]+/g.test(password)) {
    hasNumber = true;
  }

  return [
    hasMinLen ? null : "length",
    hasUpper ? null : "upper",
    hasLower ? null : "lower",
    hasNumber ? null : "number",
    hasSpecial ? null : "special",
    hasConfirmation ? null : "confirmation",
  ].filter((e) => !!e);
};
