import { Link } from "react-router";
import { useContext } from "react";
import { AppContexts } from "../providers";
import { useState, useEffect } from "react";
import { useGetCompletion } from "../api/hooks/municipality.hooks.js";

export const LeftSidebar = () => {
    const { mutateAsync: getCompletion } = useGetCompletion();

    const [loading, setLoading] = useState(null);
    const [progress, setProgress] = useState(null);

    const authContext = useContext(AppContexts.AuthContext);
    const hasAdminPermissions = !!authContext?.user?.admin; // TODO ACTUALLY CHECK PERMISSIONS

    useEffect(() => {
        (async () => {
            setLoading(true);
            let progressResp = await getCompletion();
            console.log("progressResp", progressResp);
            if (progressResp.done !== undefined && progressResp.in_progress !== undefined) {
                setProgress(progressResp);
            }
            setLoading(false);
        })();
    }, []);

  return (
      <div className="left-nav">
        <ul className="uk-list">
          <li>
            <Link to="/towns">Update Town Data</Link>
          </li>
          <li>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSekaJ1HUhgOj8M8gf6WsTKzslsCQXw7R8wGQh-swqlHv1QSww/viewform"
              target="_blank"
            >
              Report a Bug
            </a>
          </li>
          {hasAdminPermissions && <li>
            <Link to="/bulk-actions">Bulk Actions</Link>
          </li>}
        </ul>

        {!loading && progress && (
            <>
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
            </>
        )}
      </div>
    );
}