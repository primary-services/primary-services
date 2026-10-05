import { useQueryClient, useMutation } from "@tanstack/react-query";

import { downloadBlob, showNotification } from "../../utils.js";

import { uploadContacts, downloadContacts, downloadMailMerge } from "../routes/bulk-actions.routes.js";

export const useUploadContacts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["contacts", "upload"],
    mutationFn: (file) => uploadContacts(file),
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ["towns"] });

      if (results.failed > 0) {
        showNotification({
          message: `Upload finished with ${results.failed} failed row(s) (${results.updated} updated, ${results.unchanged} unchanged)`,
          status: "danger",
        });
      } else {
        showNotification({
          message: `Upload successful - ${results.updated} updated, ${results.unchanged} unchanged`,
        });
      }
    },
    onError: (error) => {
      showNotification({
        message: error.message || "Failed to upload contacts",
        status: "danger",
      });
    },
  });
};

export const useDownloadContacts = () => {
  return useMutation({
    mutationKey: ["contacts", "download"],
    mutationFn: () => downloadContacts(),
    onSuccess: (blob) => {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      downloadBlob(blob, `contacts-${timestamp}.csv`);
    },
    onError: (error) => {
      showNotification({
        message: error.message || "Failed to download contacts",
        status: "danger",
      });
    },
  });
};

export const useDownloadMailMerge = () => {
  return useMutation({
    mutationKey: ["contacts", "downloadMailMerge"],
    mutationFn: () => downloadMailMerge(),
    onSuccess: (blob) => {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      downloadBlob(blob, `mail-merge-${timestamp}.csv`);
    },
    onError: (error) => {
      showNotification({
        message: error.message || "Failed to download mail merge CSV",
        status: "danger",
      });
    },
  });
};