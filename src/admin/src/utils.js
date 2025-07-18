export const cleanDateString = (dateString) =>
  dateString ? dateString.replace(" 00:00:00 GMT", "") : dateString;

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(";").shift();
};

export const clearCookie = (name) => {
  return window.cookieStore.delete(name);
};

export const validPassword = (password, confirmation) => {
  let hasMinLen = false;
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSpecial = false;
  let hasConfirmation = false;

  if (!!password && !!confirmation && password === confirmation) {
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

export const checkRequired = (required, data) => {
  let missing_fields = [];
  required.map((field) => {
    let path = field.split(".");

    let obj = data;
    for (var i = 0; i < path.length - 1; i++) {
      obj = obj[path[i]];
    }

    if (!obj[path[path.length - 1]]) {
      missing_fields.push(path[path.length - 1]);
    }
  });

  return missing_fields;
};
