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
];
export default google.admin({
  version: "directory_v1",
  auth: googleAuthJWT(scopes, process.env.GOOGLE_ADMIN_EMAIL),
});
