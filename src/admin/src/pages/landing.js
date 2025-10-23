import { useState, useEffect } from "react";
import { Link } from "react-router";

import { useGetMarkdown } from "../api/hooks/utils.hooks.js";

export const LandingPage = () => {
  const { mutateAsync: getMarkdown } = useGetMarkdown();

  const [loading, setLoading] = useState(null);
  const [instructions, setInstructions] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const resp = await getMarkdown("office_instructions");

      if (resp.success) {
        setInstructions(resp.html);
      } else {
        setInstructions(null);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <section id="landing-page" className="page">
      <div className="left-nav">
        <ul className="uk-list">
          <li>
            <Link to="/towns">Update Town Data</Link>
          </li>
        </ul>
      </div>
      <div className="landing-content">
        {loading && <div data-uk-spinner></div>}

        {!loading && (
          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: instructions }}
          ></div>
        )}
      </div>
    </section>
  );
};
