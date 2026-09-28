export const API_URL = process.env.API_URL ?? "http://localhost:5050";
export const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";

// Resumes are uploaded straight from the browser to Cloudinary, so both values
// are public by design. Create an *unsigned* preset and restrict it to PDF/Word
// under 5 MB in the Cloudinary console, otherwise anyone could use your account.
export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
