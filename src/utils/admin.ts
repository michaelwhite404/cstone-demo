import { JWT } from "google-auth-library";
import { google } from "googleapis";

/**
 *
 * @param scopes list of requested scopes or a single scope.
 * @param imperonatedEmail impersonated account's email address.
 */
export const googleAuthJWT = (scopes?: string | string[], imperonatedEmail?: string): JWT => {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes,
    imperonatedEmail
  );
  return auth;
};

const scopes = [
  "https://www.googleapis.com/auth/admin.directory.device.chromeos",
  "https://www.googleapis.com/auth/admin.directory.orgunit",
  "https://www.googleapis.com/auth/admin.directory.group",
  "https://www.googleapis.com/auth/admin.directory.user",
];
export default google.admin({
  version: "directory_v1",
  auth: googleAuthJWT(scopes, process.env.GOOGLE_ADMIN_EMAIL),
});

export const chat = google.chat({
  version: "v1",
  auth: new google.auth.JWT({
    email: process.env.GOOGLE_CHAT_SERVICE_ACCOUNT_CLIENT_EMAIL,
    key: process.env.GOOGLE_CHAT_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/chat.bot"],
  }),
});

export const sheets = (email: string) =>
  google.sheets({
    version: "v4",
    auth: googleAuthJWT(["https://www.googleapis.com/auth/spreadsheets"], email),
  });
