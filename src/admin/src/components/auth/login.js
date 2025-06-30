import { useState, useEffect } from "react";

import { login } from "../../api/hooks/auth.hooks.js";

export const LoginForm = () => {
  let [user, setUser] = useState({
    email: "",
    password: "",
    pword: "", // bot check, this field will be invisible. Bots will fill it, people will not
  });

  let [visible, setVisible] = useState(false);
  let [errors, setErrors] = useState([]);
  let [pending, setPending] = useState(false);

  const update = (e) => {
    // setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.defaultDefault();
  };

  return (
    <div id="login-form" className="auth" container="#modals" data-uk-modal>
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">Log In</h2>

        <form onSubmit={handleLogin}>
          <div className="input-wrapper">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={user?.email || ""}
              onInput={update}
            />
          </div>

          <div className="input-wrapper">
            <label>Password</label>
            <input
              type={visible ? "test" : "password"}
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

          <button className="btn rounded blocky">
            {pending ? "Logging In..." : "Login"}
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <a href="#" data-uk-toggle="target: #signup-form">
            Sign Up
          </a>
        </p>

        <p>
          Forgot your password?{" "}
          <a href="#" data-uk-toggle="target: #reset-form">
            Reset Password
          </a>
        </p>

        <a
          className="uk-modal-close"
          href=""
          data-uk-icon="icon: close; ratio: 1.5"
        ></a>
      </div>
    </div>
  );
};
