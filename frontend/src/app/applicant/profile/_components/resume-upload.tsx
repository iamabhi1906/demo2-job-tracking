"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { CldUploadWidget } from "next-cloudinary";

const SIGNATURE_ENDPOINT = "/api/sign-cloudinary-params";
export function ResumeUpload({
  label = "Upload",
  onUploaded,
}: {
  label?: string;
  onUploaded: (secureUrl: string) => void;
}) {
  return (
    <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
      <CldUploadWidget
        signatureEndpoint={SIGNATURE_ENDPOINT}
        onSuccess={(result) => {
          if (typeof result.info === "object" && "secure_url" in result.info) {
            onUploaded(result.info.secure_url);
          }
        }}
        options={{
          singleUploadAutoClose: true,
          sources: ["local"],
          multiple: false,
          folder: "job-tracker/resumes",
          clientAllowedFormats: ["pdf", "doc", "docx"],
          maxFileSize: 5 * 1024 * 1024,
        }}
      >
        {({ open }) => (
          <Button
            type="button"
            variant="outlined"
            loadingPosition="center"
            onClick={() => {
              open();
            }}
          >
            {label}
          </Button>
        )}
      </CldUploadWidget>
    </Stack>
  );
}
