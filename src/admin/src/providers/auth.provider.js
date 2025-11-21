import { apiRoot } from "../constants.js";
import { getCookie, clearCookie } from "../utils.js";
import { createContext, useState } from "react";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [user, setUser] = useState(null);

  const authContext = {
    loading,
    user,

    authorize: async () => {
      setPending(true);

      let token = getCookie("auth_token") || "";

      try {
        let resp = await fetch(`${apiRoot}/authorize`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).then((resp) => {
          return resp.json();
        });

        if (!resp.id) {
          setUser(null);
        } else {
          setUser(resp);
        }
      } catch (e) {
        console.log(e);
      }

      setPending(false);
      setLoading(false);
    },

    login: async (data) => {
      setPending(true);

      let resp = await fetch(`${apiRoot}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((resp) => {
        return resp.json();
      });

      setPending(false);
      setLoading(false);

      if (!resp.success) {
        setUser(null);
        return resp;
      } else {
        setUser(resp.user);
        return resp;
      }
    },

    signup: async (data) => {
      setPending(true);

      let resp = await fetch(`${apiRoot}/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((resp) => {
        return resp.json();
      });

      setPending(false);
      setLoading(false);

      if (!resp.success) {
        setUser(null);
        return resp;
      } else {
        setUser(resp.user);
        return resp;
      }
    },

    logout: async () => {
      await clearCookie("auth_token");
      window.location.assign("/login");
    },

    request_password_reset: (data) => {
      return fetch(`${apiRoot}/request_password_reset`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((resp) => {
        return resp.json();
      });
    },

    reset_password: (data) => {
      return fetch(`${apiRoot}/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((resp) => {
        return resp.json();
      });
    },
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};
