import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";

import { AppContexts } from "../../providers";
import { checkRequired } from "../../utils.js";

export const LoginPage = () => {
  let [user, setUser] = useState({
    email: "",
    password: "",
    pword: "", // bot check, this field will be invisible. Bots will fill it, people will not
  });

  let [visible, setVisible] = useState(false);
  let [error, setError] = useState();
  let [errors, setErrors] = useState([]);
  let [pending, setPending] = useState(false);

  const { login } = useContext(AppContexts.AuthContext);

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

  const handleLogin = async (e) => {
    e.preventDefault();

    let requiredFields = ["email", "password"];
    let missing_fields = checkRequired(requiredFields, user);

    if (missing_fields.length > 0) {
      setError("Please fill out all required fields");
      setErrors(missing_fields);

      return;
    }

    let resp = await login(user);

    if (resp.success === true) {
      window.location.assign("/");
    } else {
      setError(resp.error);
      setErrors(resp.fields || ["email", "password"]);
    }
  };

  return (
    <section id="landing-page" className="page">
      <div id="login-form" className="auth">
        <div className="uk-modal-body">
          <h2 className="uk-modal-title">Log In</h2>

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

            <div className={`input-wrapper password ${errorClass("password")}`}>
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

            <div className="input-wrapper bot-check">
              <label>Password Confirmation</label>
              <input
                type="text"
                name="pword"
                value={user?.pword || ""}
                onInput={update}
              />
            </div>

            <div className="btn blocky clicky" onClick={handleLogin}>
              {pending ? "Logging In..." : "Login"}
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
