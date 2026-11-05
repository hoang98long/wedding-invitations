export type GuestbookErrorCode =
  | "GUESTBOOK_NOT_CONFIGURED"
  | "GUESTBOOK_INVALID_URL"
  | "GUESTBOOK_INVALID_KEY"
  | "GUESTBOOK_ACCESS_DENIED"
  | "GUESTBOOK_SCHEMA_MISSING"
  | "GUESTBOOK_UNAVAILABLE";

export class GuestbookStorageError extends Error {
  constructor(public readonly code: GuestbookErrorCode, message: string) {
    super(message);
    this.name = "GuestbookStorageError";
  }
}

export function needsGuestbookSetup(code?: string) {
  return !!code && ["GUESTBOOK_NOT_CONFIGURED", "GUESTBOOK_INVALID_URL", "GUESTBOOK_INVALID_KEY", "GUESTBOOK_ACCESS_DENIED", "GUESTBOOK_SCHEMA_MISSING"].includes(code);
}
