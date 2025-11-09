import owasp from "owasp-password-strength-test";

owasp.config({
  allowPassphrases: false,
});

/**
 * Removes the time from a date string
 * @param  {String} dateString
 * @return {String}
 */
export const cleanDateString = (dateString) =>
  dateString ? dateString.replace(" 00:00:00 GMT", "") : dateString;

/**
 * Get a cookie by name
 * @param  {String} name The cookie's name
 * @return {String}      The cookie's value
 */
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(";").shift();
};

/**
 * Removed a cookie by name
 * @param  {String} name
 * @return {Promise}
 */
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

/**
 * Ensures that the obj is an array
 * @param  {[array | falsy]} a
 * @return {[array]}
 */
export const arr = (a) => {
  return a || [];
};

/**
 * Ensures that the obj is an object
 * @param  {[object | falsey]} o
 * @return {[object]}
 */
export const obj = (o) => {
  return o || {};
};

/**
 * Creates a confirm dialog
 * @param  {String}   text      Whatever message to display to the user
 * @param  {Function} onConfirm The function that should be executed if confirmed
 * @param  {Function} onCancel  The function that should be executed if cancelled
 * @param  {Object}   options   For the future, an object of options
 */
export const confirm = (
  text = "",
  onConfirm = () => {},
  onCancel = () => {},
  options = {},
) => {
  let container = document.createElement("div");

  container.className = `dh-modal-confirmation ${options.className || ""}`;
  container.innerHTML = `
    <div class='dh-header'>
      <span uk-icon='icon: close' class='icon dh-close'>
    </div>
    <div class='dh-content'>
      ${text}
    </div>
    <div class='dh-actions'>
      <div class='confirm btn blocky clicky'>Confirm</div>
      <div class='cancel btn blocky clicky rev'>Cancel</div>
    </div>
  `;

  let resolver;

  let promise = new Promise((res) => {
    resolver = res;
  });

  let close = () => {
    window.removeEventListener("click", close);
    container.parentNode.removeChild(container);
    resolver();
  };

  container.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  window.addEventListener("click", close);

  container.querySelector(".confirm").addEventListener("click", (e) => {
    onConfirm();
    close();
  });

  container.querySelector(".cancel").addEventListener("click", (e) => {
    onCancel();
    close();
  });

  document.body.appendChild(container);

  return promise;
};

// status is one of "primary", "success", "warning", "danger"
export const showNotification = ({message, status = "primary", timeout = 1500}) => {
  window.UIkit.notification({
    message,
    status,
    timeout,
  });
}

export const confirmDeleteThen = (callbackFn) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    callbackFn();
  }
}