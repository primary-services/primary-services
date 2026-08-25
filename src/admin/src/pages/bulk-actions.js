import { useState, useEffect, useContext } from "react";
import { AppContexts } from "../providers";
import { Link } from "react-router";
import { LeftSidebar } from "../components/left-sidebar.js";

import { useUploadContacts, useDownloadContacts } from "../api/hooks/contacts.hooks.js";
import { useGetCompletion } from "../api/hooks/municipality.hooks.js";


export const BulkActions = () => {
    const authContext = useContext(AppContexts.AuthContext);
    const loadingAuth = authContext.loading;
    const hasSuperuserPermissions = !!authContext.user?.superuser;

    const { mutate: downloadContacts} = useDownloadContacts();
    const { mutate: uploadContacts} = useUploadContacts();

    return (
    <section id="landing-page" className="page">
        <LeftSidebar />
        <div className="landing-content">
            {loadingAuth && <div data-uk-spinner></div>}

            {!loadingAuth && hasSuperuserPermissions && (
                <div className="uk-width-1-1">
                        <h3>Bulk actions for accessing & updating MA Democracy data</h3>
                        <p>Only super-users can perform these actions. If you have questions, please reach out to the organizing team.</p>
                        <hr />
                        <p>
                            Download a CSV file containing all the town contacts (clerk, assistant clerk, and admin assistant) 
                            as well as the date that information was last updated, whether or not the office has provided us information 
                            in the past, and current town completion status. You can edit this file and upload it below for bulk updates.
                        </p>
                        <button className="bulk-actions-button" onClick={() => downloadContacts()}>Download town contacts</button>
                        <hr />
                        <p>
                            Upload a CSV file with updated town contacts. The file must have the same columns as the downloaded file above, 
                            and the "Town" and "Municipality ID" columns must not be changed. All other columns can be updated, and any changes 
                            will be reflected in the database except the "Contact Info Last Updated" column, which will be automatically updated to the 
                            current date for any towns that have changes. <strong>Before you upload anything, please download a copy of the current data and upload 
                            to our shared Google Drive.</strong> This is to ensure we can revert to a previous version if there are any issues with the upload. 
                            If you have questions, please reach out to the organizing team.
                        </p>
                        <label className="bulk-actions-button" htmlFor="upload-contacts-input">Upload updated town contacts</label>
                        <input
                            id="upload-contacts-input"
                            type="file"
                            accept=".csv"
                            style={{ position: "absolute", width: 1, height: 1, opacity: 0, overflow: "hidden" }}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) uploadContacts(file);
                                e.target.value = "";
                            }}
                        />
                </div>
            )}
            
            {!loadingAuth && !hasSuperuserPermissions && (
                <div className="uk-width-1-1">
                    <h2>You do not have permission to perform bulk actions</h2>
                </div>
            )}
        </div>
    </section>
    );
};
