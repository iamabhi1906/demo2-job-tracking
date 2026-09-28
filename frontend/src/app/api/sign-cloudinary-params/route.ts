import { v2 as cloudinary } from "cloudinary";

const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: apiSecret,
});

export async function POST(request: Request) {
  if (!apiSecret) {
    return Response.json(
      { error: "Cloudinary is not configured on the server" },
      { status: 500 },
    );
  }

  const { paramsToSign } = (await request.json()) as {
    paramsToSign?: Record<string, string>;
  };

  if (!paramsToSign || typeof paramsToSign !== "object") {
    return Response.json(
      { error: "paramsToSign is required" },
      { status: 400 },
    );
  }

  return Response.json({
    signature: cloudinary.utils.api_sign_request(paramsToSign, apiSecret),
  });
}
