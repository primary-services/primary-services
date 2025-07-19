import owasp from "owasp-password-strength-test";

owasp.config({
  allowPassphrases: false,
});

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
  let tested = owasp.test(password);
  let { failedTests: failures } = tested;

  let hasLen = !failures.includes(0) && !failures.includes(1);
  let noRepeat = password.length >= 3 && !failures.includes(2);
  let hasLower = !failures.includes(3);
  let hasUpper = !failures.includes(4);
  let hasNumber = !failures.includes(5);
  let hasSpecial = !failures.includes(6);
  let hasConfirmation =
    !!password && !!confirmation && password === confirmation;

  return [
    hasLen ? null : "length",
    hasUpper ? null : "upper",
    hasLower ? null : "lower",
    hasNumber ? null : "number",
    hasSpecial ? null : "special",
    hasConfirmation ? null : "confirmation",
    noRepeat ? null : "repeating",
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
