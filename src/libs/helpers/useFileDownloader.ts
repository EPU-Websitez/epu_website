// src/helpers/useFileDownloader.ts

import { useState, useCallback } from "react";

/**
 * Custom hook to handle file downloads with loading states.
 * @returns An object with the `downloadFile` function and a `downloadingFiles` Set.
 */
export const useFileDownloader = () => {
  // Use a Set to store the paths of files currently being downloaded.
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set()
  );

  const downloadFile = useCallback(
    async (filePath?: string | null, suggestedName?: string | null) => {
      // Use the file path as the unique identifier.
      if (!filePath) return;

      // Add the file to the downloading set to show the spinner.
      setDownloadingFiles((prev) => new Set(prev).add(filePath));

      try {
        const res = await fetch(filePath, { mode: "cors" });
        if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);

        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);

        // Logic to determine the final file name
        const pathName = new URL(filePath).pathname;
        const ext = pathName.includes(".")
          ? `.${pathName.split(".").pop()!}`
          : "";
        const cleanName = (suggestedName || "").trim();
        const nameHasExt = cleanName && /\.[a-z0-9]{1,8}$/i.test(cleanName);

        const fileName =
          (nameHasExt && cleanName) ||
          (cleanName && `${cleanName}${ext}`) ||
          pathName.split("/").pop() ||
          "download";

        // Trigger the download
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
      } catch (e) {
        console.error("Download failed:", e);
        // Fallback to opening in a new tab if there's an error (e.g., CORS)
        window.open(filePath, "_blank", "noopener,noreferrer");
      } finally {
        // Always remove the file from the downloading set when finished.
        setDownloadingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(filePath);
          return newSet;
        });
      }
    },
    []
  );

  return { downloadFile, downloadingFiles };
};
