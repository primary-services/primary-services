import { QueryClient, useQueryClient, useMutation } from "@tanstack/react-query";

import { downloadBlob } from "../../utils.js";

import { uploadContacts, downloadContacts } from "../routes/contacts.routes.js";

export const useUploadContacts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["contacts", "upload"],
    mutationFn: (file) => uploadContacts(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["towns"] });
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
  });
};
