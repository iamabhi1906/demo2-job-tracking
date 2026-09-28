type UploadWidgetResult = {
  event?: string;
  info?: { secure_url?: string };
};

type UploadWidget = {
  open: () => void;
  on: (event: string, callback: () => void) => void;
};

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (
          error: { message?: string } | null,
          result: UploadWidgetResult,
        ) => void,
      ) => UploadWidget;
    };
  }
}

export {};
