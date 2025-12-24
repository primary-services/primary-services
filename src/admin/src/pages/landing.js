import { useState, useEffect } from "react";
import { Link } from "react-router";

import { useGetMarkdown } from "../api/hooks/utils.hooks.js";
import { useGetCompletion } from "../api/hooks/municipality.hooks.js";

export const LandingPage = () => {
  const { mutateAsync: getMarkdown } = useGetMarkdown();
  const { mutateAsync: getCompletion } = useGetCompletion();

  const [loading, setLoading] = useState(null);
  const [instructions, setInstructions] = useState(null);
  const [progress, setProgress] = useState({
    done: 0,
    in_progress: 0,
  });

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

      let progressResp = await getCompletion();
      if (resp.success) {
        setProgress(progressResp);
      }
    })();
  }, []);

  return (
    <section id="landing-page" className="page">
      <div className="left-nav">
        <ul className="uk-list">
          <li>
            <Link to="/towns">Update Town Data</Link>
          </li>
          <li>
            <a
              href="https://docs.google.com/spreadsheets/d/1d4eHMwQLlPJGJvA7URVZ9ZICRqVVCny_uu6mj2j5a4Q/edit"
              target="_blank"
            >
              Town Assignments
            </a>
          </li>
          <li>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSekaJ1HUhgOj8M8gf6WsTKzslsCQXw7R8wGQh-swqlHv1QSww/viewform"
              target="_blank"
            >
              Report a Bug
            </a>
          </li>
        </ul>

        <div className="progress">
          <div
            className="in_progress"
            style={{
              height: (progress.in_progress / 351) * 300,
              bottom: 50 + (progress.done / 351) * 300,
            }}
          ></div>
          <div
            className="done"
            style={{ height: (progress.done / 351) * 300 }}
          ></div>
          <div className="bulb"></div>
          <div className="thermometer"></div>
        </div>

        <p>{progress.done} / 351 Towns Completed</p>
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
