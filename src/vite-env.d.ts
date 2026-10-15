/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Firebase Realtime Database URL that stores RSVP responses */
  readonly VITE_FIREBASE_DB_URL?: string;
  /** Firebase Web API key, used to sign in to the /responses page */
  readonly VITE_FIREBASE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
