import { useState, useEffect, useContext } from "react";
import { AppContexts } from "../providers";
import { Link } from "react-router";
import { LeftSidebar } from "../components/left-sidebar.js";

import { useGetMarkdown } from "../api/hooks/utils.hooks.js";
import { useGetCompletion } from "../api/hooks/municipality.hooks.js";

export const BulkActions = () => {
    const authContext = useContext(AppContexts.AuthContext);
    const loadingAuth = authContext.loading;
    const hasPermissions = !!authContext.user?.admin;

    return (
    <section id="landing-page" className="page">
        <LeftSidebar />
        <div className="landing-content">
            {loadingAuth && <div data-uk-spinner></div>}

            {!loadingAuth && hasPermissions && (
                <div className="uk-width-1-1">
                    <button className="bulk-actions-button" onClick={() => {}}>Download town contacts</button>
                    <button className="bulk-actions-button" onClick={() => {}}>Upload updated town contacts</button>
                </div>
            )}
            
            {!loadingAuth && !hasPermissions && (
                <div className="uk-width-1-1">
                    <h2>You do not have permission to perform bulk actions</h2>
                </div>
            )}
        </div>
    </section>
    );
};
