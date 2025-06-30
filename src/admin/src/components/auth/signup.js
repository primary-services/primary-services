import { useState, useEffect } from "react";

import { useSignup } from "../../api/hooks/auth.hooks.js";

import { validPassword } from "./utils.js";

export const SignupForm = () => {
  let [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    pword: "", // bot check, this field will be invisible. Bots will fill it, people will not
  });

  let [visible, setVisible] = useState(false);
  let [errors, setErrors] = useState([]);
  let [pending, setPending] = useState(false);

  const { mutateAsync: signup } = useSignup();

  const update = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    let errs = validPassword(user.password, user.password_confirmation);
    if (errs.length !== 0) {
      setErrors(errs);
      return;
    }

    let resp = await signup(user);
    console.log(resp);
  };

  return (
    <div id="signup-form" className="auth" container="#modals" data-uk-modal>
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">Sign Up</h2>

        <form>
          <div className="grid">
            <div className="input-wrapper width-6-12">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={user?.first_name || ""}
                onInput={update}
              />
            </div>

            <div className="input-wrapper width-6-12">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={user?.last_name || ""}
                onInput={update}
              />
            </div>

            <div className="input-wrapper width-12-12">
              <label>Email</label>
              <input
                type="text"
                name="email"
                value={user?.email || ""}
                onInput={update}
              />
            </div>

            <div className="input-wrapper width-12-12">
              <label>Password</label>
              <input
                type={visible ? "test" : "password"}
                name="password"
                value={user?.password || ""}
                onInput={update}
              />
            </div>

            <div className="input-wrapper width-12-12">
              <label>Password Confirmation</label>
              <input
                type={visible ? "test" : "password"}
                name="password_confirmation"
                value={user?.password_confirmation || ""}
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
          </div>

          <div className="btn blocky clicky" onClick={handleSignup}>
            Save
          </div>
        </form>

        <p>
          Already have an account?{" "}
          <a href="#" data-uk-toggle="target: #login-form">
            Sign In
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
