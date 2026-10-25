/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_MOBILE_RELEASE_CHANNEL?: string;
  readonly VITE_ANDROID_APP_DOWNLOAD_URL?: string;
  readonly VITE_ANDROID_APP_VERSION?: string;
  readonly VITE_ANDROID_APP_SIZE?: string;
  readonly VITE_ANDROID_APP_UPDATED_AT?: string;
  readonly VITE_ANDROID_APP_SHA256?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
