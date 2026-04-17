import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";

import { AppContexts } from "../../providers";
import { checkRequired, validPassword } from "../../utils.js";

export const ResetPage = () => {
  let [user, setUser] = useState({
    password: "",
    password_confirmation: "",
    token: "",
    pword: "", // bot check, this field will be invisible. Bots will fill it, people will not
  });

  let [visible, setVisible] = useState(false);
  let [error, setError] = useState();
  let [errors, setErrors] = useState([]);
  let [validation, setValidation] = useState([]);
  let [pending, setPending] = useState(false);

  const { reset_password } = useContext(AppContexts.AuthContext);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");

    setUser({ ...user, token: token });
  }, []);

  useEffect(() => {
    setValidation(validPassword(user.password, user.password_confirmation));
  }, [user]);

  const isValid = (check) => {
    return !validation.includes(check);
  };

  const update = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });

    let errs = [];
    setErrors(errs);
    if (errs.length === 0) {
      setError("");
    }
  };

  const errorClass = (field) => {
    return errors.includes(field) ? "error" : "";
  };

  const handleReset = async (e) => {
    e.preventDefault();

    let requiredFields = ["password", "password_confirmation"];
    let missing_fields = checkRequired(requiredFields, user);

    if (missing_fields.length > 0) {
      setError("Please fill out all required fields");
      setErrors(missing_fields);

      return;
    }

    let errs = validPassword(user.password, user.password_confirmation);
    if (errs.length !== 0) {
      setError("Please enter a valid password, and confirmation");
      setErrors(["password", "password_confirmation"]);
      return;
    }

    let resp = await reset_password(user);

    if (resp.success === true) {
      window.location.assign("/?password_reset=1");
    } else {
      setError(resp.error);
      setErrors(resp.fields || ["password", "password_confirmation"]);
    }
  };

  return (
    <section id="auth-page" className="page">
      <div id="signup-form" className="auth">
        <div className="uk-modal-body">
          <h2 className="uk-modal-title">Reset Password</h2>

          <form>
            <p className="error">{error}</p>

            <div className="grid">
              <div className="width-6-12">
                <div
                  className={`input-wrapper password ${errorClass("password")}`}
                >
                  <label>Password</label>
                  <a
                    href="#"
                    uk-icon="icon: eye"
                    aria-label="View/Hide Password"
                    onClick={() => {
                      setVisible(!visible);
                    }}
                  ></a>
                  <input
                    type={visible ? "text" : "password"}
                    name="password"
                    value={user?.password || ""}
                    onInput={update}
                  />
                </div>

                <div
                  className={`input-wrapper ${errorClass("password_confirmation")}`}
                >
                  <label>Password Confirmation</label>
                  <input
                    type={visible ? "text" : "password"}
                    name="password_confirmation"
                    value={user?.password_confirmation || ""}
                    onInput={update}
                  />
                </div>
              </div>
              <div className="width-6-12">
                <div className="rules">
                  <div className="input-wrapper">
                    <label>Password Rules</label>
                  </div>
                  <div className="validation">
                    <div className="input-wrapper checkbox">
                      <input type="checkbox" checked={isValid("length")} />
                      <label>Between 10 and 128 characters</label>
                    </div>

                    <div className="input-wrapper checkbox">
                      <input type="checkbox" checked={isValid("repeating")} />
                      <label>No repeating character sequences</label>
                    </div>

                    <div className="input-wrapper checkbox">
                      <input type="checkbox" checked={isValid("upper")} />
                      <label>At least 1 upper case letter</label>
                    </div>

                    <div className="input-wrapper checkbox">
                      <input type="checkbox" checked={isValid("lower")} />
                      <label>At least 1 lower case letter</label>
                    </div>

                    <div className="input-wrapper checkbox">
                      <input type="checkbox" checked={isValid("number")} />
                      <label>At least 1 number</label>
                    </div>

                    <div className="input-wrapper checkbox">
                      <input type="checkbox" checked={isValid("special")} />
                      <label>At least 1 of the following !@#$%^&_</label>
                    </div>

                    <div className="input-wrapper checkbox">
                      <input
                        type="checkbox"
                        checked={isValid("confirmation")}
                      />
                      <label>Password and confirmation match</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="input-wrapper bot-check">
              <label>Password Confirmation</label>
              <input
                type="text"
                name="pword"
                value={user?.pword || ""}
                onInput={update}
              />
            </div>

            <div className="btn blocky clicky" onClick={handleReset}>
              {pending ? "Resetting..." : "Reset"}
            </div>
          </form>

          <a
            className="uk-modal-close"
            href=""
            data-uk-icon="icon: close; ratio: 1.5"
          ></a>
        </div>
      </div>
    </section>
  );
};
