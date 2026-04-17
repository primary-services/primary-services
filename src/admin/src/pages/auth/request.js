import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";

import { AppContexts } from "../../providers";
import { checkRequired } from "../../utils.js";

export const RequestPage = () => {
  let [user, setUser] = useState({
    email: "",
    pword: "", // bot check, this field will be invisible. Bots will fill it, people will not
  });

  let [visible, setVisible] = useState(false);
  let [error, setError] = useState();
  let [errors, setErrors] = useState([]);
  let [pending, setPending] = useState(false);

  const { request_password_reset } = useContext(AppContexts.AuthContext);

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

  const handleRequest = async (e) => {
    e.preventDefault();

    let requiredFields = ["email"];
    let missing_fields = checkRequired(requiredFields, user);

    if (missing_fields.length > 0) {
      setError("Please fill out all required fields");
      setErrors(missing_fields);

      return;
    }

    let resp = await request_password_reset(user);

    if (resp.success === true) {
      window.UIkit.notification({
        message: `An Email has been sent to the address you requested. Please follow the instructions there`,
        status: "primary",
        pos: "bottom-left",
        timeout: 5000,
      });
    } else {
      setError(resp.error);
      setErrors(resp.fields || ["email"]);

      window.UIkit.notification({
        message: `An error has occurred`,
        status: "danger",
        pos: "bottom-left",
        timeout: 5000,
      });
    }
  };

  return (
    <section id="auth-page" className="page">
      <div id="login-form" className="auth">
        <div className="uk-modal-body">
          <h2 className="uk-modal-title">Request Password Reset</h2>

          <form>
            <p className="error">{error}</p>
            <div className={`input-wrapper ${errorClass("email")}`}>
              <label>Email</label>
              <input
                type="text"
                name="email"
                value={user?.email || ""}
                onInput={update}
              />
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

            <div className="btn blocky clicky" onClick={handleRequest}>
              {pending ? "Requsting..." : "Request"}
            </div>
          </form>

          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>

          <p>
            Forgot your password?{" "}
            <Link to="request-password-reset">Reset Password</Link>
          </p>

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
