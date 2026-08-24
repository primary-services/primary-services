import { useState, useEffect } from "react";
import { Link } from "react-router";

import { useGetMarkdown } from "../api/hooks/utils.hooks.js";
import { useGetCompletion } from "../api/hooks/municipality.hooks.js";
import { LeftSidebar } from "../components/left-sidebar.js";

export const LandingPage = () => {
  const { mutateAsync: getMarkdown } = useGetMarkdown();
  const { mutateAsync: getCompletion } = useGetCompletion();

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
      <LeftSidebar />
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
